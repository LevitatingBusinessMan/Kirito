class Hentai {
    constructor() {
        this.help = {
            "description": "Hentai image (CFs API)",
            "usage": "[prefix]hentai"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": false,
            "nsfw": true,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        message.respond(await Kirito.getImage('hentai', message.member, args[0]))
    }
}

module.exports = Hentai;