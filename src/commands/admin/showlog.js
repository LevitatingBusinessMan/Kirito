class Showlog {
    constructor() {
        this.help = {
            "description": "Show current log",
            "usage": "[prefix]showLog"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if(!Kirito.config.log) 
            return message.respond("Logs aren't enabled!");
        const fs = require('fs');
        const path = require('path');
        let file = fs.readFileSync(path.join(Kirito.rootDir, "log", Kirito.logger.logFile)).toString();

        message.respond(`\`\`\`ini\n${file}\`\`\``);
    }
}

module.exports = Showlog;