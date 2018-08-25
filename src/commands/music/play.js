class Play {
    constructor() {
        this.help = {
            "description": "I'll do this documentation later",
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
        .catch(data => {
            Kirito.log('err', `Error loading song with args: ${args.join(' ')}`);
            if (Kirito.config.raven)
                Kirito.Raven.captureException(data);
            message.respond(":x: Oops! An error occured")
        }).then(track => {
        //Playlist
        if (track instanceof Array)
            message.respond('Playlist')
        else {
            play(track);
        }
        });

        function play(track) {
            let {manager} = Kirito;
            
            //No player for guild yet
            if (!manager.players.has(message.guild.id)) {
                let player = manager.join({
                    guild: message.guild.id, // Guild id
                    channel: message.member.voiceChannel.id, // Channel id
                    host: Kirito.config.lavaLinkNode.host // lavalink host, based on array of nodes
                })
                player.play(track.track);
                //Display thing in discord channel
                player.queue = [];
                player.once("error", err => {
                    if (Kirito.config.raven)
                        Kirito.Raven.captureException(err);
                    Kirito.logger.error(err);
                });
                player.once("end", data => {
                    if (data.reason === "REPLACED") return;
                    if (player.queue) {
                        play(queue[0]);
                        player.queue.splice(0,1);
                    } else player.disconnect("EMPTY_QUEUE");
                });
                player.once("disconnect", msg => {manager.players.delete(message.guild.id)})
                manager.players.set(message.guild.id, player);
            } else {
                let player = manager.players.get(message.guild.id);
                player.play(track.track);
                //Display thing in discord channel
            }

        }
    }
}

module.exports = Play;