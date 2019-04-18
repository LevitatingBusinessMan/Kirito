console.log('\033[2J');
const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');
const axios = require("axios");
const { spawn } = require('child_process');
const { PlayerManager } = require("discord.js-lavalink");
const reload = require('require-reload')(require);

class Kirito extends Discord.Client {
    constructor() {
        super();
        this.Discord = Discord;
        this.rootDir = path.join(__dirname, "..");
        this.debug = process.argv.includes('-debug');
        this.dev = process.argv.includes('-dev');

        require(path.join(__dirname, "./util/prototypes.js"));

        (async () => {
            this.config = require(path.join(__dirname, "../config/config.js"));

            if (this.config.log)
                this.logger = new (require(path.join(__dirname, "./util/logger.js")))(path.join(__dirname, "../log"), this.config.max_logs);
            else this.logger = new (require(path.join(__dirname, "./util/logger.js")))();
            this.log = this.logger.log.bind(this.logger);

            if (this.debug)
                this.log("info", "Starting in debug mode")

            if (this.dev)
                this.log("info", "Starting in dev mode")

            //Process events
            process.on('exit', code => {
                this.logger.log('err', `Process exited with code ${code}`);
            });
            
            process.on('exit', err => 
                this.logger.error(err)
            );

            this.loadUtilities();
            this.savedMessages = new Map();

            const spinner = require(path.join(__dirname, "./util/spinner.js"));

            //Enmap
            const enmap = require("enmap");
            if (this.config.db === "rethink") {

                const enmap_rethink = require("enmap-rethink");

                this.users_ = new enmap({provider: new enmap_rethink(Object.assign({name:"users"}, this.config.rethink))});
                this.guilds_ = new enmap({provider: new enmap_rethink(Object.assign({name:"guilds"}, this.config.rethink))});
    
                let usersDraft = new spinner(this.logger.parse("info","Loading users from DB %s"), 300,);
                let guildsDraft = new spinner(this.logger.parse("info","Loading guilds from DB %s"), 300,);
    
                this.users_.defer.then(() => usersDraft.stop(this.logger.parse('info',`Users loaded: ${this.users_.size}`)));
                this.guilds_.defer.then(() => guildsDraft.stop(this.logger.parse('info',`Guilds loaded: ${this.guilds_.size}`)));

            }

            else if (this.config.db === "level") {

                const enmap_level = require("enmap-level");

                let dataDir = path.join(__dirname, "../data");

                if (!fs.existsSync(dataDir))
                    fs.mkdirSync(dataDir)

                this.users_ = new enmap({provider: new enmap_level({name:"users",dataDir})});
                this.guilds_ = new enmap({provider: new enmap_level({name:"guilds",dataDir})});
    
                let usersDraft = new spinner(this.logger.parse("info","Loading users from DB %s"), 300,);
                let guildsDraft = new spinner(this.logger.parse("info","Loading guilds from DB %s"), 300,);
    
                this.users_.defer.then(() => usersDraft.stop(this.logger.parse('info',`Users loaded: ${this.users_.size}`)));
                this.guilds_.defer.then(() => guildsDraft.stop(this.logger.parse('info',`Guilds loaded: ${this.guilds_.size}`)));

            }

            else {
                this.logger.log("ERR", "Invalid DB option. Valid options: level & rethink");
                process.exit();
            }



            //Events and Commands
            this.loadCommands();
            this.loadEvents();

            //Sadly the recursive option doesn't work on linux (watching subdirectories)
            if (this.dev) {
                fs.readdirSync(path.join(__dirname, './commands')).forEach(category => {
                    let last = null;

                    //filename is not always supplied here, which is why we reload ALL commands.
                    //For instance when new file could is created, but fsWatch doesn't supply a filename we can't load it.
                    fs.watch(path.join(__dirname, './commands', category), (event, filename) => {
                        
                        //Sometimes the listener gets called multiple times, we fix this by wating at least 2 seconds between each reload.
                        if (last + 2*1000 > new Date().getTime())
                            return;

                        this.log("info",`Noticed change in file: ${filename ? filename : "uknown file"}`)
                        this.loadCommands();
                        last = new Date().getTime();
                    })
                })
                this.log("info", "Change listener for commands active");
            }

            //Disable commands with missing keys
            require(path.join(__dirname,'./util/keyCheck'))(this);

            //Package JSON
            this.pjson = require((path.join(__dirname,'../package.json')));

            //Axios
            this.axios = axios;
            this.axios.defaults.headers.common["User-Agent"] = `Kirito/${this.pjson.version} (nodeJS)`;
            this.axios.defaults.timeout = 5000;

            let afterLogin = async () => {
                this.config.token = null;
                
                //Set LavaLink Manager
                if (this.config.lavaLinkNode) {
                    const { PlayerManager } = require("discord.js-lavalink");
                    this.manager = new PlayerManager(this, [this.config.lavaLinkNode], {
                        user: this.user.id,
                        shards: 1
                    });
                    this.manager.players = new Discord.Collection();

                    //Axios instance for LavaLink Rest API
                    this.lavaRest = (id) => {
                        return this.axios({
                            timeout: this.config.lavaRestTimeout,
                            url: `http://${this.config.lavaLinkNode.host}:2333/loadtracks`,
                            headers: {"Authorization": this.config.lavaLinkNode.password},
                            params: {"identifier":id}
                        });
                    }
                }

                //Set up Raven
                if (this.config.raven)
                    this.Raven = require("raven").config(this.config.raven).install();

                //Launch express
                if (this.config.express) {
                    this.server = await (require(path.join(__dirname, "./util/api.js")))(this);
                    this.logger.info("API on > http://localhost:3000");
                }
            }

            //Logging in
            this.loginSpinner = new spinner("Logging in.. %s  ", 300, "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
            this.login(this.config.token).then(afterLogin);
        })();
    }

    loadCommands(){
        const fs = require('fs');
        const path = require('path');
        this.commands = {};

        let count = 0;
        let failed = 0;
        let failedFiles = [];
        fs.readdirSync(path.join(__dirname, './commands')).forEach(category =>
            fs.readdirSync(path.join(__dirname, './commands', category)).forEach(file => {
                count++;
                try {
                    var command = new (reload(path.join(__dirname, './commands', category, file)))();
                } catch(e) {
                    this.logger.log('err', `Error loading command ${file}`);
                    if (this.debug)
                        this.logger.error(e);
                    failedFiles.push(file);
                    failed++;
                    return;
                }

                command.category = category;
                command.name = command.constructor.name.toLowerCase();
                
                if (!this.config.lavaLinkNode && category === "music")
                    command.conf.disabled = true;

                this.commands[command.name] = command;
                
                if (!this.commandAliases)
                    this.commandAliases = {};

                command.conf.aliases.forEach(alias => {
                    this.commandAliases[alias.toLowerCase()] = this.commands[command.name];
                });
            })
        );     
        this.log(failed > 0 ? "warn" : "info",`Commands loaded: ${count-failed}/${count}`);
        return {
            "success": count-failed,
            "total": count,
            failedFiles
        }
    }

    loadEvents() {
        const fs = require('fs');
        const path = require('path');

        let count = 0;
        let failed = 0;
        let failedFiles = [];
        fs.readdirSync(path.join(__dirname, './events')).forEach(file => {
            count++;
            try {
                let event = require(path.join(__dirname, './events', file));
                this.on(event.name, (...args) => event(this, args));
            } catch(e) {
                this.logger.log('err', `Error loading event ${file}`);
                if (this.debug)
                    this.logger.error(e);
                failedFiles.push(file);
                failed++;
                return;
            }
        });
        this.log(failed > 0 ? "warn" : "info",`Events loaded: ${count-failed}/${count}`);
        return {
            "success": count-failed,
            "total": count,
            failedFiles
        }
    }

    userEntry(user) {
        return {
            id: user.id,
            name: user.username,
            bio: false,
            whMessages: [],
            points: 0
        }
    }

    guildEntry(guild) {
        return {
            id: guild.id,
            name: guild.name,
            autoroles: [],
            autoflip: false,
            greeting: null,
            farewell: null,
            messageChannel: null,
            wormholeChannel: null,
            musicChannel: null,
            prefix: null
        }
    }

    loadUtilities(){
        this.renderHelp = reload(path.join(__dirname, "./util/renderHelp.js"));
        this.getImage = reload(path.join(__dirname, "./util/getImage.js"));
        this.getUser = reload(path.join(__dirname, "./util/getUser.js"));
        this.getSong = reload(path.join(__dirname, "./util/getSong.js"));
        this.createPlayer = reload(path.join(__dirname, "./util/createPlayer.js"))
        this.wait = (ms,fn)=>{let id=setInterval(()=>{clearInterval(id);fn();},ms)};
    }
}

new Kirito({disableEveryone: true});
