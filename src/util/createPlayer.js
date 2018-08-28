module.exports = function createPlayer(guildID, vChannelID, ogChannelID) {
    let perms = this.channels.get(vChannelID).permissionsFor(this.guilds.get(guildID).me);
    if (!perms.has("VIEW_CHANNEL") || !perms.has("CONNECT") || !perms.has("SPEAK"))
        return null;
    
    let {manager} = this;
    let player = manager.join({
        guild: guildID,
        channel: vChannelID,
        host: this.config.lavaLinkNode.host
    });
    player.queue = [];
    player.loop = false;
    player.nowPlaying = null;
    player.ogChannelID = ogChannelID;
    player.sendMessage = track => {
        let {musicChannel,bigPlayCards} = this.guilds_.get(guildID);
        if (musicChannel) {
            if (this.channels.has(musicChannel))
                var channel = this.channels.get(musicChannel);
            else {
                let g = this.guilds_.get(guildID);
                g.musicChannel = null;
                this.guilds_.set(g.id,g);
            }
        } else var channel = this.channels.get(ogChannelID);

        channel.send(player.createEmbed(false))
    }
    player.createEmbed = (showProgress, time) => {
        let {nowPlaying,state,paused} = player;
        if (time) state.position = time;
        let embed = new this.Discord.RichEmbed()
        .setAuthor(nowPlaying.info.author)
        .setTitle(nowPlaying.info.title)
        .setURL(nowPlaying.info.uri)
        .setColor(0x0066ff)
        .setFooter(nowPlaying.author,nowPlaying.authorAvatar)
        .setTimestamp(nowPlaying.timestamp);

        if (showProgress) {
            const dayjs = require("dayjs");
            let timeSpent = dayjs(state.position).format("m:ss");
            let timeLength = nowPlaying.info.isStream ?"∞":dayjs(nowPlaying.info.length).format("m:ss");
            let progress = nowPlaying.info.isStream ?1:state.position/nowPlaying.info.length;
            let progressBarLength = 20;
            let progressBar = "─".repeat(progress*progressBarLength) + (paused?":pause_button:":":white_circle:") + "─".repeat(progressBarLength - progress*progressBarLength);
            embed.setDescription(`[${timeSpent}]${progressBar}[${timeLength}]`);
        }
        return embed;
    } 
    player.on("error", err => {
        if (this.config.raven)
            this.Raven.captureException(err);
        this.logger.error(err);
        manager.leave(guildID)
        manager.players.delete(guildID);
    });
    player.on("end", data => {
        if (data.reason === "REPLACED") return;
        if (data.reason === "STOPPED") return;
        if (player.loop)
            player.queue.push(player.nowPlaying);

        if (player.queue.length) {          
            player.play(player.queue[0].track);
            player.sendMessage(player.queue[0]);
            player.nowPlaying = player.queue[0];

            player.queue.shift();
        } else {
            manager.leave(guildID)
            manager.players.delete(guildID);
        }
    });
    player.on("disconnect", msg => {
        manager.leave(guildID)
        manager.players.delete(guildID);
    });
    manager.players.set(guildID, player);
    return player;
}