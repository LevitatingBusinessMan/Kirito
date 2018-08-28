class Leave {
    constructor() {
        this.help = {
            "description": "Make Kirito leave the voice channel and stop playing music",
            "usage": "[prefix]leave"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["stop"],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": false,
            "sameVC": true,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (Kirito.manager.players.has(message.guild.id)) {
            Kirito.manager.leave(message.guild.id)
            Kirito.manager.players.delete(message.guild.id);
        } else message.respond("There is no player active!!");
    }
}

module.exports = Leave;