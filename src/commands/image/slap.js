class Slap {
    constructor() {
        this.help = {
            "description": "Slap someone! (rem api)",
            "usage": "[prefix]slap somePerson"
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
        message.respond(await Kirito.getImage('slap', message.member, args[0]))
    }
}

module.exports = Slap;