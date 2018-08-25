class Reload {
    constructor() {
        this.help = {
            "description": "Reload all commands",
            "usage": "[prefix]reload"
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
        Kirito.commands = {};
        Kirito.log('info','Performing command reload')
        let result = Kirito.loadCommands();
        let msg = `Loaded \`${result.success}/${result.total}\` commands\n`;
        if (result.failedFiles.length) {
            msg += `Failed: ${result.failedFiles.join(', ')}`;
        }

        message.respond({embed:{
            title: 'Command reload',
            description: msg,
            color: result.failedFiles.length?0xff0000:0x00ff00
        }});
    }
}

module.exports = Reload;