class Pat {
    constructor() {
        this.help = {
            "description": "Pat someone (rem api)",
            "usage": "[prefix]pat"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        message.respond(await Kirito.getImage('pat', message.member, args[0]))
    }
}

module.exports = Pat;