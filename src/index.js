console.log('\033[2J');
const Discord = require('discord.js');

class Kirito extends Discord.Client {
    constructor() {
        super();
        const path = require('path');
        const fs = require('fs');
        const chalk = require('chalk');

        this.config = require('../config/config.js');
        this.prompt = new (require('./util/prompt.js'))("Kirito");
        this.logger = new (require('./util/logging.js'))(path.join(__dirname, '../log'));

        //Prompt Commands
        fs.readdirSync(path.join(__dirname, './promptCommands')).forEach(cmdFile =>
            this.prompt.addCommand(require('./promptCommands/' + cmdFile))
        );

        //Process events
        process.on('exit', code => 
            this.logger.log('err', `Process exited with code ${code}`)    
        );
        process.on('unhandledRejection', (reason, place) =>
            this.logger.log('err', `Unhandled rejection at: ${place}, reason: ${reason}`)
        );

        let spinner = new (require("./util/spinner.js"))("Loggin in.. %s  ", 300, "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
        this.login(this.config.token);
        this.on('ready', () => spinner.stop());

        //After whole setup
        //this.prompt.openNew();

        //this.logger.log('ok', 'test')
    }
    loadCommands(){

    }
    loadEvents(){

    }
}

new Kirito();
