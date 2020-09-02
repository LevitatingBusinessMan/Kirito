class Cat {
    constructor() {
        this.help = {
            "description": "Cat image (Cat API)",
            "usage": "[prefix]cat"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": false,
            "requires": ["CatAPIkey"]
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        message.respond(await Kirito.getImage('cat', message.member, args[0]))
    }
}

module.exports = Cat;