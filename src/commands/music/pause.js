class Pause {
    constructor() {
        this.help = {
            "description": "Pause or resume the current song",
            "usage": "[prefix]pause"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["resume"],
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
            let player = Kirito.manager.players.get(message.guild.id);

            if (player.paused) {
                player.pause(false);
                message.respond(":arrow_forward:");
            } else {
                player.pause(true);
                message.respond(":pause_button:");
            }
        } else message.respond("There is no song playing!");
    }
}

module.exports = Pause;