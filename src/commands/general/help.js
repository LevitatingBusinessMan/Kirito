class Help {
    constructor() {
        this.help = {
            "description": "Show all commands or a specific command",
            "usage": "[prefix]help command"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": "",
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (Kirito.commands[args[0]] || Kirito.commandAliases[args[0]])
            chn.send(Kirito.renderHelp(args[0]));
        else chn.send(
        Kirito.config.admins.includes(message.author.id) ?
            Kirito.renderHelp() :
            Kirito.renderHelp().withoutAdmin()
        )
    }
}

module.exports = Help;
