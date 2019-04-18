class Autoflip {
    constructor() {
        this.help = {
            "description":
`
Possibly one of the most important features of this bot.

It flips... tables.
\`[prefix]autoflip -on\` to turn it on ┬─┬ ノ( ゜-゜ノ)
\`[prefix]autoflip -on\` for UNLIMITED TABLE FLIPPING
(╯°□°）╯︵ ┻━┻
(╯°□°）╯︵ ┻━┻
(╯°□°）╯︵ ┻━┻
(╯°□°）╯︵ ┻━┻
(╯°□°）╯︵ ┻━┻

`,
            "usage": "[prefix]autoflip -on"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["flip"],
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
        const guild = Kirito.guilds_.get(message.guild.id);
        
        if (!args[0]) return message.respond(`Auto table-unflipping is turned **${guild.autoflip ? "on" : "off"}**`);

        if (["-on","-off"].includes(args[0])) {
            let author = message.guild.members.get(message.author.id);
            if (!author.hasPermission("MANAGE_GUILD")) 
                return message.respond("You don't have the **manage_server** permission!")
            
            if (args[0] == "-off") guild.autoflip = false;
            if (args[0] == "-on") guild.autoflip = true;

            Kirito.guilds_.set(guild.id, guild);
            
            if (args[0] == "-on")
                message.respond(`Auto table-unflipping is now **on**\nYou can try it out by flipping a table upside down like any sane person would =D`);
            else message.respond("Auto table-unflipping is now **off**")
        } else message.respond("Invalid option")
    }
}

module.exports = Autoflip;