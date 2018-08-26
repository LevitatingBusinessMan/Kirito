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
        let embed = new this.Discord.RichEmbed()
        .setAuthor(track.info.author)
        .setTitle(track.info.title)
        .setURL(track.info.uri)
        .setColor(0x0066ff)
        .setFooter(track.author,track.authorAvatar)
        .setTimestamp(track.timestamp);
        channel.send(embed)
    }
    player.on("error", err => {
        if (this.config.raven)
            this.Raven.captureException(err);
        this.logger.error(err);
    });
    player.on("end", data => {
        if (data.reason === "REPLACED") return;
        if (player.queue.length) {          
            player.play(player.queue[0].track);
            player.sendMessage(player.queue[0]);
            player.nowPlaying = player.queue[0];

            if (!player.loop)
                player.queue.shift();
            else player.queue.push(player.queue.shift());
        } else {
            //Queue empty, but loop enabled
            if (player.loop) {
                player.play(player.nowPlaying.track);
                player.sendMessage(player.nowPlaying);
                return;
            }
            manager.leave(guildID)
            manager.players.delete(guildID);
        }
    });
    manager.players.set(guildID, player);
    return player;
}