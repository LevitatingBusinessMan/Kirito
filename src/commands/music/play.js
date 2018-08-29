class Play {
    constructor() {
        this.help = {
            "description": `
Play a song or playlist. Supported sources:
\`YouTube\`
\`SoundCloud\`
\`Bandcamp\`
\`Vimeo\`
\`Twitch streams\`
\`Local files\`
\`HTTP URLs\`

If no specific link is specified Kirito will search Youtube.
When argument \`-sc\` is used Kirito will search Soundcloud
`,
            "usage": "[prefix]play We Are Number One"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": "*",
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (!message.member.voiceChannel)
            return message.respond(":x: You are not in a voice channel!");

        Kirito.getSong(message, args)
        .catch(e => {
            Kirito.log('err',e);
            if (Kirito.config.raven)
                Kirito.Raven.captureException(e);
            message.respond(":x: Oops! An error occured")
        }).then(track => {
            if (!track)
                return message.respond(":x: Failed loading track");
            
            if (!Kirito.manager.players.has(message.guild.id))
                var player = Kirito.createPlayer(message.guild.id, message.member.voiceChannel.id, message.channel.id);
            else
                var player = Kirito.manager.players.get(message.guild.id);
            if (!player)
                return message.respond(":x: Missing permissions!");

            //Playlist
            if (track instanceof Array) {
                let tracks = track;
                tracks.forEach(track => {
                    track.author = message.author.tag;
                    track.authorAvatar = message.author.avatarURL;
                    track.timestamp = new Date();
                });

                player.queue = player.queue.concat(tracks);
                if (!player.track)
                    player.emit('end',"START_QUEUE");
            }
            //Single track
            else {
                track.author = message.author.tag;
                track.authorAvatar = message.author.avatarURL;
                track.timestamp = new Date();

                player.play(track.track);
                player.nowPlaying = track;
                player.sendMessage(track);
            }
        });
    }
}

module.exports = Play;