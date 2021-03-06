class Farewell {
    constructor() {
        this.help = {
            "description": 
`Change or display the servers farewell message

Placeholders:
\`%user%\`: username (Kirito)
\`%user-tag%\`: Username with tag (Kirito#0001)
\`%mention%\`: mention (@kirito#0001)
\`%server%:\` Name of server

To disable: \`[prefix]farewell -remove\`
To change channel: \`[prefix]farewell -channel <channel>\``,
            "usage": "[prefix]farewell Bye bye %user%!"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["setFarewell"],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        let guild = Kirito.guilds_.get(message.guild.id);
        if (args.length) {
            if (message.member.hasPermission("MANAGE_GUILD")) {
                //Change channel
                if (args[0] === "-channel") {
                    if (!message.guild.me.permissionsIn(args[1].replace(/<|#|>/g,"")).has("SEND_MESSAGES"))
                        return  message.respond(`I don't have the permission to speak in <#${args[1].replace(/<|#|>/g,"")}>`);

                    if (Kirito.channels.get(args[1].replace(/<|#|>/g,""))) {
                        guild.messageChannel = args[1].replace(/<|#|>/g,"");
                        Kirito.guilds_.set(guild.id,guild);
                        return message.respond(`Channel for welcome/farewell messages is now ${args[1]}`)
                    }
                    else return message.respond("That is not a channel!");
                }

                //Remove
                if (args[0] === "-remove") {
                    guild.greeting = null;
                    Kirito.guilds_.set(guild.id,guild);
                    return message.respond(`Farewell message removed!`)
                }

                //Check if channel exists
                if (!guild.messageChannel || !Kirito.channels.has(guild.messageChannel))
                    return message.respond(`Please set a default channel first with \`${prefix}farewell -channel #somechannel\``)
                
                //Change message
                let farewell = args.join(" ")
                .replace("%user%", message.author.username)
                .replace("%user-tag%", message.author.tag)
                .replace("%mention%", `<@${message.author.id}>`)
                .replace("%server%", message.guild.name)
                .replace("%guild%", message.guild.name);

                let embed = new Kirito.Discord.RichEmbed()
                .setTitle("Confirm changing farewell message to:")
                .setDescription(farewell)
                .setFooter("Remember: mentions, tags and servernames are available");

                let msg = await message.respond(embed);
                msg.confirm();
                msg.accept(() => {
                    guild.farewell = args.join(" ");
                    Kirito.guilds_.set(guild.id,guild);
                    msg.edit(embed.setTitle('Changed farewell message to:'));
                }).deny(() => msg.edit(embed.setTitle('Cancelled changing farewell to:')));

            } else message.respond("You don't have the manage_server permission!");
        }
        else {
            message.respond(new Kirito.Discord.RichEmbed()
            .setTitle(message.guild.name)
            .addField("Greeting", guild.greeting ? guild.greeting : "none")
            .addField("Farewell", guild.farewell ? guild.farewell : "none")
            .addField("Channel", guild.messageChannel ? `<#${guild.messageChannel}>` : "none")
            .setFooter("Change with farewell and greeting commands"));
        }
    }
}

module.exports = Farewell;