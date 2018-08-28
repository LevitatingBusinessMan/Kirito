class Np {
    constructor() {
        this.help = {
            "description": "Show the current playing song",
            "usage": "[prefix]np"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["nowplaying"],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (Kirito.manager.players.has(message.guild.id))
            message.respond(Kirito.manager.players.get(message.guild.id).createEmbed(true));
        else message.respond("There is no song playing");
    }
}

module.exports = Np;