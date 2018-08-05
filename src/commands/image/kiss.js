class Kiss {
    constructor() {
        this.help = {
            "description": "Kiss someone (rem api)",
            "usage": "[prefix]kiss"
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
        message.respond(await Kirito.getImage('kiss', message.member, args[0]))
    }
}

module.exports = Kiss;