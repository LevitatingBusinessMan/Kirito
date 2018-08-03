class Cuddle {
    constructor() {
        this.help = {
            "description": "Cuddle with someone (rem api)",
            "usage": "[prefix]cuddle"
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
        chn.send(await Kirito.getImage('cuddle', message.member, args[0]))
    }
}

module.exports = Cuddle;