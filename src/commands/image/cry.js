class Cry {
    constructor() {
        this.help = {
            "description": "Cry image (rem api)",
            "usage": "[prefix]cry"
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
        chn.send(await Kirito.getImage('cry', message.member, args[0]))
    }
}

module.exports = Cry;