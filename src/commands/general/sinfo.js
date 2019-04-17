const dayjs = require("dayjs");

class Sinfo {
    constructor() {
        this.help = {
            "description": "Shows some juicy info about the server",
            "usage": "[prefix]sinfo"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["server_info"],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": false,
            "sameVC": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        const g = message.guild;

        const embed = new Kirito.Discord.RichEmbed()
            .setTitle(g.name)
            .setThumbnail(g.iconURL)
            .setFooter(`${g.owner.user.username} | ${g.name}`, g.owner.user.avatarURL)
            .setTimestamp(g.createdAt)
            .addField("Owner", g.owner.user.username + (g.owner.nickname ? ` (${g.owner.nickname})` : ""), false)
            .addField("Members", g.members.size, true)
            .addField("Channels:", g.channels.size, true)
            .addField("Bots:", g.members.filter(x => x.user.bot).size, true)
            .addField("Roles:", g.roles.size, true)
            .addField("Emoji's:", g.emojis.size, true)
            .addField("Region:", g.region, true)
            .addBlankField()
            
            let verification;
            switch (g.verificationLevel) {
                case 0:
                    verification = "none";
                    break;
                case 1:
                    verification = "low";
                    break;
                case 2:
                    verification = "medium";
                    break;
                case 3:
                    verification = "(╯°□°）╯︵ ┻━┻";
                    break;
                case 4:
                    verification = "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻";

            }

            embed.addField("Verification:", verification, false)
            
            embed.addField("Created:", dayjs(g.createdAt).format("D MMMM YYYY, HH:mm (s [seconds]) [UTC]Z"), false)

        message.respond(embed);

    }
}

module.exports = Sinfo;