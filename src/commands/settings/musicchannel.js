class Musicchannel {
    constructor() {
        this.help = {
            "description":
`
Change the servers music text channel.
If this is set, all automatically played songs will be logged in that channel.
If this is not, the channel the first music command was made in will be used.

[prefix]musicchannel <channel>, to define a channel
[prefix]musicchannel -remove, to remove this channel again

`,
            "usage": "[prefix]musicchannel <channel>"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["music_channel", "mchannel"],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": "str",
            "sameVC": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        const g = Kirito.guilds_.get(message.guild.id);

        if (args[0] == "-remove") {
            g.musicChannel = null;
            Kirito.guilds_.set(g.id,g);

            message.respond(`Disabled using <#${g.musicChannel}> as music log`)
        } else {
            const channelID = args[0].replace(/<|#|>/g,"");

            if (Kirito.channels.get(channelID)) {
                if (!message.guild.me.permissionsIn(channelID).has("SEND_MESSAGES"))
                    return  message.respond(`I don't have the permission to speak in <#${channelID}>`);

                g.musicChannel = channelID;
                Kirito.guilds_.set(g.id,g);
                return message.respond(`The music output channel is now <#${channelID}>`)
            }
            else return message.respond("That is not a channel!");
        }
    }
}

module.exports = Musicchannel;