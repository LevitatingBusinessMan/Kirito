class Hug {
    constructor() {
        this.help = {
            "description": "Hug someone (rem api)",
            "usage": "[prefix]hug"
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
        chn.send(await Kirito.getImage('hug', message.member, args[0]))
    }
}

module.exports = Hug;