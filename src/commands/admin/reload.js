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
        Kirito.log('info','Performing command reload');
        let result = Kirito.loadCommands();
        Kirito.loadUtilities();
        let msg = `Loaded \`${result.success}/${result.total}\` commands\n`;
        if (result.failedFiles.length) {
            msg += `Failed: ${result.failedFiles.join(', ')}`;
        }

        message.respond(new Kirito.Discord.RichEmbed()
        .setTitle("Command reload")
        .setDescription(msg)
        .setColor(result.failedFiles.length ? "RED" : "GREEN"))
    }
}

module.exports = Reload;