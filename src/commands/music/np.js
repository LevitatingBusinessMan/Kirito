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
        if (Kirito.manager.players.has(message.guild.id)) {
            let {nowPlaying,state,paused} = Kirito.manager.players.get(message.guild.id);
            let embed = new Kirito.Discord.RichEmbed()
            .setAuthor(nowPlaying.info.author)
            .setTitle(nowPlaying.info.title)
            .setURL(nowPlaying.info.uri)
            .setColor(0x0066ff)
            .setFooter(nowPlaying.author,nowPlaying.authorAvatar)
            .setTimestamp(nowPlaying.timestamp);

            const dayjs = require("dayjs");
            let timeSpent = dayjs(state.position).format("m:ss");
            let timeLength = nowPlaying.info.isStream ?"∞":dayjs(nowPlaying.info.length).format("m:s");
            let progress = nowPlaying.info.isStream ?1:state.position/nowPlaying.info.length;
            let progressBarLength = 20;
            let progressBar = "─".repeat(progress*progressBarLength) + (paused?":pause_button:":":white_circle:") + "─".repeat(progressBarLength - progress*progressBarLength);
            embed.setDescription(`[${timeSpent}]${progressBar}[${timeLength}]`);

            message.respond(embed);
        } else message.respond("There is no song playing");
    }
}

module.exports = Np;