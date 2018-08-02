console.log('\033[2J');
const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');

class Kirito extends Discord.Client {
    constructor() {
        super();
        this.Discord = Discord;

        require(path.join(__dirname, "./util/prototypes.js"));

        (async () => {
            this.config = require(path.join(__dirname, "../config/config.js"));

            if (this.config.log)
            this.logger = new (require('./util/logger.js'))(path.join(__dirname, '../log'));
            this.log = this.logger.log;

            //Process events
            process.on('exit', code => 
                this.logger.log('err', `Process exited with code ${code}`)    
            );

            this.loadUtilities();
            this.editMessages = new Map();

            const spinner = require(path.join(__dirname, "./util/spinner.js"));

            //Enmap
            const enmap = require("enmap");
            const enmap_level = require("enmap-level");
            const dataDir = path.join(__dirname, "../data");

            this.users_ = new enmap({provider: new enmap_level({name:"users",dataDir})});
            this.guilds_ = new enmap({provider: new enmap_level({name:"guilds",dataDir})});
            //this.stats = new enmap({provider: new enmap_level({name:"stats",dataDir})});

            let usersDraft = new spinner(this.logger.parse("ok","Loading users from DB %s"), 300,);
            let guildsDraft = new spinner(this.logger.parse("ok","Loading guilds from DB %s"), 300,);

            this.users_.defer.then(() => usersDraft.stop(this.logger.parse('ok',`Users loaded: ${this.users_.size}`)));
            this.guilds_.defer.then(() => guildsDraft.stop(this.logger.parse('ok',`Guilds loaded: ${this.guilds_.size}`)));

            //Events and Commands
            this.loadCommands();
            this.loadEvents();

            //Disable commands with missing keys
            require(path.join(__dirname,'./util/keyCheck'))(this);

            //Logging in
            this.loginSpinner = new spinner("Logging in.. %s  ", 300, "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
            this.login(this.config.token);

        })();
    }

    loadCommands(){
        const fs = require('fs');
        const path = require('path');

        let count = 0;
        let failed = 0;
        fs.readdirSync(path.join(__dirname, './commands')).forEach(category =>
            fs.readdirSync(path.join(__dirname, './commands', category)).forEach(file => {
                count++;
                try {
                    var command = new (require(path.join(__dirname, './commands', category, file)))();
                } catch(e) {
                    this.logger.log('err', `Error loading command ${file}`);
                    failed++;
                    return;
                }

                command.category = category;
                command.name = command.constructor.name.toLowerCase();

                if (!this.commands)
                    this.commands = {};
                
                this.commands[command.name] = command;
                
                if (!this.commandAliases)
                    this.commandAliases = {};

                command.conf.aliases.forEach(alias => {
                    this.commandAliases[alias] = this.commands[command.name];
                });
            })
        );
        this.log(failed > 0 ? "warn" : "ok",`Commands loaded: ${count-failed}/${count}`);
    }

    loadEvents() {
        const fs = require('fs');
        const path = require('path');

        let count = 0;
        let failed = 0;
        fs.readdirSync(path.join(__dirname, './events')).forEach(file => {
            count++;
            try {
                let event = require(path.join(__dirname, './events', file));
                this.on(event.name, (...args) => event(this, args));
            } catch(e) {
                this.logger.log('err', `Error loading event ${file}`)
                failed++;
                return;
            }
        });
        this.log(failed > 0 ? "warn" : "ok",`Events loaded: ${count-failed}/${count}`);
    }

    userEntry(user) {
        return {
            id: user.id,
            name: user.username,
            tag: user.discriminator,
            bio: false,
            points: 0
        }
    }

    guildEntry(guild) {
        return {
            id: guild.id,
            name: guild.name,
            prefix: false
        }
    }

    loadUtilities(){
        this.renderHelp = require(path.join(__dirname, "./util/renderHelp.js"));
        this.getImage = require(path.join(__dirname, "./util/getImage.js"));
        this.getUser = require(path.join(__dirname, "./util/getUser.js"));
    }
}

new Kirito({disableEveryone: true});
