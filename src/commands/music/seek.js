class Seek {
    constructor() {
        this.help = {
            "description": "Move the player position to a set time\n Format: `m:ss`",
            "usage": "[prefix]seek 1:23"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": /^(\d*:([0-5]\d)|(60))$/,
            "sameVC": true,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (Kirito.manager.players.has(message.guild.id)) {
            let player = Kirito.manager.players.get(message.guild.id);
            if (player.nowPlaying.info.isStream)
                return message.respond("A stream is currently playing!");
            let time = args[0].split(":")[0]*60*1000 + args[0].split(":")[1]*1000;
            if (time > player.nowPlaying.info.length)
                return message.respond("The song is not that long!");
            player.seek(time);
            message.respond({embed:player.createEmbed(true, time)});
        } else message.respond("There is no player active!!");
    }
}

module.exports = Seek;