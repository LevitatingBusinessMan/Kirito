class Wormhole {
    constructor() {
        this.help = {
            "description": `
Send messages through time and space.
Who knows where they might end???

To send wormhole messages:
[prefix]wh send <message>

To receive wormhole messages:
[prefix]wh -open <channel>

To stop receiving wormhole messages:
[prefix]wh -close <channel>
`,
            "usage": "[prefix]wormhole send My name is Jeff!"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["wh"],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": "str",
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        //Send
        if (args[0] === "send") {
            if (!args[1])
                return message.respond('Cannot send empty message!');
            
            (function search() {
                var guild = Kirito.guilds_.filter(x => x.wormholeChannel).random();
                if (!guild)
                    message.respond("No open wormholes found");
                else if (Kirito.channels.has(guild.wormholeChannel)){
                    let embed = new Kirito.Discord.RichEmbed()
                    .setColor(0x0066ff)
                    .setDescription(args.splice(1).join(" "))
                    .setFooter(`${message.guild.name} | ${message.author.tag}`,message.guild.iconURL);
                    Kirito.channels.get(guild.wormholeChannel).send(embed);
                    message.respond(`Your message has travelled through time and space and ended up in **${guild.name}**`);
                }
                else {
                    guild.wormholeChannel = null;
                    Kirito.guilds_.set(guild.id,guild);
                    search();
                }
            })();
        }

        //Open
        else if (args[0] === "-open") {
            if (message.member.hasPermission("MANAGE_GUILD")) {
                let channel = args[1];
                if (!args[1])
                    channel = `<#${message.channel.id}>`;
                if (Kirito.channels.get(channel.replace(/<|#|>/g,""))) {
                    let embed = new Kirito.Discord.RichEmbed()
                    .setTitle("Confirmation opening wormhole")
                    .setColor(0x0066ff)
                    .setDescription(`Are you sure you want to open a wormhole in ${channel}?\n`
                    + "This will allow messages from other guilds to come in")

                    let msg = await message.respond(embed);
                    msg.confirm();
                    msg.accept(() => {
                        let guild = Kirito.guilds_.get(message.guild.id);
                        guild.wormholeChannel = channel.replace(/<|#|>/g,"");
                        Kirito.guilds_.set(guild.id,guild);
                        delete embed.description;
                        embed.setTitle("Confirmed opening wormhole");
                        msg.edit(embed);
                        Kirito.channels.get(channel.replace(/<|#|>/g,"")).send({
                            embed:{
                                title:"A wormhole has been opened here!",
                                color: 0x0066ff
                        }});
                    });
                    msg.deny(() => {
                        delete embed.description;
                        embed.setTitle("Cancelled opening wormhole")
                        msg.channel.send(embed)
                    });

                } else message.respond("That is not a channel!");
            }
            else message.respond("You don\'t have the manage_server permission!")
        }

        //Close
        else if (args[0] === "-close") {
            let guild = Kirito.guilds_.get(message.guild.id);
            if (message.member.hasPermission("MANAGE_GUILD")) {
                if (!Kirito.channels.has(guild.wormholeChannel))
                    return message.respond("There is no wormhole open in this server!")
                let msg = await message.respond(`Are you sure you want to close the wormhole in <#${guild.wormholeChannel}>`)
                msg.confirm();
                msg.accept(() => {
                    msg.edit(`Wormhole closed in <#${guild.wormholeChannel}>`);
                    Kirito.channels.get(guild.wormholeChannel).send({
                        embed:{
                            title:"The wormhole here has been closed!",
                            color: 0x0066ff
                    }});
                    guild.wormholeChannel = null;
                    Kirito.guilds_.set(guild.id, guild);
                }).deny(() => msg.edit(`Cancelled closing Wormhole in in <#${guild.wormholeChannel}>`))
            } else message.respond("You don\'t have the manage_server permission!")
        }
        else message.respond('That is not a valid argument. Take a look at this commands help:',Kirito.renderHelp(this.name))
    }
}

module.exports = Wormhole;