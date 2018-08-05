class Rem {
    constructor() {
        this.help = {
            "description": "Rem image (rem api)",
            "usage": "[prefix]rem"
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
        message.respond(await Kirito.getImage('rem', message.member, args[0]))
    }
}

module.exports = Rem;