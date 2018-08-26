class Move {
    constructor() {
        this.help = {
            "description": "Move Kirito to your current voicechannel",
            "usage": "[prefix]move"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (!message.member.voiceChannel)
            return message.respond(":x: You are not in a voice channel!");

        if (Kirito.manager.players.has(message.guild.id)) {
            let channelID = message.member.voiceChannel.id;

            let perms = Kirito.channels.get(channelID).permissionsFor(message.guild.me);
            if (!perms.has("VIEW_CHANNEL") || !perms.has("CONNECT") || !perms.has("SPEAK"))
                return message.respond("I have insufficient perms for that channel");
            
            let player = Kirito.manager.players.get(message.guild.id);
            player.switchChannel(channelID, true);

        } else message.respond("There is no player active!!");
    }
}

module.exports = Move;