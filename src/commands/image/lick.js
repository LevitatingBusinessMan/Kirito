class Lick {
    constructor() {
        this.help = {
            "description": "Lick someone (rem api)",
            "usage": "[prefix]lick"
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
        chn.send(await Kirito.getImage('lick', message.member, args[0]))
    }
}

module.exports = Lick;