console.log('\033[2J');
const Discord = require('discord.js');

class Kirito extends Discord.Client {
    constructor() {
        super();
        const path = require('path');
        const fs = require('fs');

        (async () => {
            this.config = require('../config/config.js');
            
            if (this.config.log)
            this.logger = new (require('./util/logging.js'))(path.join(__dirname, '../log'));
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

            this.setInterval(() => {let test = 0;},100)

            //Logging in
            let spinner = new (require("./util/spinner.js"))("Loggin in.. %s  ", 300, "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
            this.on('ready', () => spinner.stop());
            await this.login(this.config.token);

            //After whole setup

            //this.logger.log('ok', 'test')

        })();
    }
    loadCommands(){
        const fs = require('fs');
        const path = require('path');

        fs.readdirSync(path.join(__dirname, './commands')).forEach(category =>
            fs.readdirSync(path.join(__dirname, './commands', category)).forEach(file => {
                try {
                    var command = new (require(path.join(__dirname, './commands', category, file)))();
                } catch(e) {
                    this.logger.log('err', `Error loading command ${file}`)
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
    }
    loadEvents(){

    }
}

new Kirito();
