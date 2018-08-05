class Nom {
    constructor() {
        this.help = {
            "description": "Nom image (rem api)",
            "usage": "[prefix]nom"
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
        message.respond(await Kirito.getImage('nom', message.member, args[0]))
    }
}

module.exports = Nom;