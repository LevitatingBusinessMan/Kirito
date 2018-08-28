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
        
        file = file.substring(file.length - 1990);
        message.respond(`\`\`\`ini\n${file}\`\`\``).then(msg => msg.destruct());
    }
}

module.exports = Showlog;