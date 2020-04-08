class Rejoin {
    constructor() {
        this.help = {
            "description": "Make Kirito rejoin your VoiceChannel to hopefully resolve bugs",
            "usage": "[prefix]rejoin"
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
            let player = Kirito.manager.players.get(message.guild.id)
            
            let msg = message.respond({embed:{title:"Rejoining",color:0xff0000}});
            
            let {track, queue, state, channel, id, ogChannelID, nowPlaying} = player;
            let voiceChannel = message.guild.me.voiceChannel;
            player.disconnect("RECONNECT");

            player = Kirito.createPlayer(id,channel,ogChannelID);
            
            setTimeout(() => {
                player.play(track);
                player.seek(state.position);
                player.nowPlaying = nowPlaying;
                player.queue = queue;
            }, 100);

            (await msg).edit({embed:{title:"State: Rejoined!",color:0x00ff00}}); 
        } else message.respond("There is no active player!");
    }
}

module.exports = Rejoin;