class Volume {
    constructor() {
        this.help = {
            "description": "Changes/shows the volume of the player",
            "usage": "[prefix]volume 50"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
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
            if (!args.length) {
                let volume = player.state.volume;
                message.respond(":loud_sound: " + "─".repeat(volume/10-1) + "○" + "─".repeat(9-(volume/10-1)) + ` (${volume}%)`);
            } else {
                if (args[0] > 0 && args[0] <= 100) {
                    player.volume(args[0]);
                    message.respond(":loud_sound: " + "─".repeat(args[0]/10-1) + "○" + "─".repeat(9-(args[0]/10-1)) + ` (${args[0]}%)`);
                }
                else message.respond(":x: Volume should be between 1 and 100");
            }
        } else message.respond("There is no player active!!");
    }
}

module.exports = Volume;