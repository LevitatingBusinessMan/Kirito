class Skip {
    constructor() {
        this.help = {
            "description": "Skip the current song",
            "usage": "[prefix]skip"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["next"],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (Kirito.manager.players.has(message.guild.id)) {
            let player = Kirito.manager.players.get(message.guild.id);
            //console.log(player.nowPlaying);
            message.respond(`Skipped song: \`${player.nowPlaying.info.title}\``);
            player.emit('end','SKIPPED');
        } else message.respond("There is no song playing!");
    }
}

module.exports = Skip;