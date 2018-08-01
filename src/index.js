console.log('\033[2J');
const Discord = require('discord.js');

class Kirito extends Discord.Client {
    constructor() {
        super();
        const path = require('path');
        const fs = require('fs');
        const r = require('rethinkdb');
        
        require(path.join(__dirname, "./util/prototypes"));

        (async () => {
            this.config = require('../config/config.js');
            
            await require(path.join(__dirname, "./util/RethinkDBInstaller"));

            if (this.config.log)
            this.logger = new (require('./util/logger.js'))(path.join(__dirname, '../log'));
            this.log = this.logger.log;

            //Process events
            process.on('exit', code => 
                this.logger.log('err', `Process exited with code ${code}`)    
            );
            process.on('unhandledRejection', (reason, place) =>
                this.logger.log('err', `Unhandled rejection at: ${place}, reason: ${reason}`)
            );

            this.loadCommands();
            this.loadEvents();

            //Logging in
            this.loginSpinner = new (require("./util/spinner.js"))("Logging in.. %s  ", 300, "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
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

                command.help.category = category;
                command.name = command.constructor.name.toLowerCase();

                if (!this.commands)
                    this.commands = {};
                
                this.commands[command.name] = command;
                
                command.conf.aliases.forEach(alias => {
                    this.commandAliases = this.commands[command.name];
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
}

new Kirito();
