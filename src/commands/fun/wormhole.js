class Wormhole {
    constructor() {
        this.help = {
            "description": `
Send messages through time and space.
Who knows where they might end up???

To send wormhole messages:
[prefix]wh send <message>

To receive wormhole messages:
[prefix]wh open <channel>

To stop receiving wormhole messages:
[prefix]wh close <channel>
`,
            "usage": "[prefix]wh send My name is Jeff!"
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
            
            let user = Kirito.users_.get(message.author.id);
            let prevMessages = user.whMessages.filter(time => new Date() - time < 3600000)
            if (prevMessages.length >= 5)
                return message.respond(':octagonal_sign: You have hit the limit of 5 messages an hour!');

            (function search() {
                var guild = Kirito.guilds_.filter(x => x.wormholeChannel && x.id !== message.guild.id).random();
                if (!guild)
                    message.respond("No open wormholes found");
                else if (Kirito.channels.has(guild.wormholeChannel)){
                    let embed = new Kirito.Discord.RichEmbed()
                    .setColor(0x0066ff)
                    .setDescription(args.splice(1).join(" "))
                    .setFooter(`${message.guild.name} | ${message.author.tag}`,message.guild.iconURL);
                    Kirito.channels.get(guild.wormholeChannel).send(embed);
                    message.respond(`Your message has travelled through time and space and ended up in **${guild.name}**`);

                    //Add msg, remove previous
                    prevMessages.push(message.createdTimestamp);
                    user.whMessages = prevMessages;
                    Kirito.users_.set(user.id,user);
                }
                else {
                    guild.wormholeChannel = null;
                    Kirito.guilds_.set(guild.id,guild);
                    search();
                }
            })();
        }

        //Open
        else if (args[0] === "open") {
            if (!message.member.hasPermission("MANAGE_GUILD"))
                return message.respond("You don\'t have the manage_server permission!")
            
            let channelID;

            //Assume message channel if no channel specified
            if (!args[1])
                channelID = message.channel.id;
            else
                channelID = args[1].replace(/<|#|>/g,"");

            const channel = Kirito.channels.get(channelID);

            if (!channel)
                return  message.respond("That is not a channel!");
            
            if (!message.guild.me.permissionsIn(channel).has("SEND_MESSAGES"))
                return  message.respond(`I can't open a wormhole in <#${channel.id}> because I don't have the permission to speak there.`);

            const guild = Kirito.guilds_.get(message.guild.id);

            let embed = new Kirito.Discord.RichEmbed().setColor(0x0066ff);

            //There is already a wormhole open
            if (message.guild.channels.has(guild.wormholeChannel)) {
                
                //Trying to open already open wormhole
                if (guild.wormholeChannel == channel.id)
                    return message.respond(`There is already a wormhole in <#${channel.id}>`);
                
                //Moving wormhole
                else if (Kirito.channels.has(guild.wormholeChannel)) {

                    let {name} = Kirito.channels.get(guild.wormholeChannel);

                    embed
                        .setTitle(`Confirmation moving wormhole from **${name}** to **${channel.name}**`)
                        .setDescription(`There is already an existing wormhole at <#${guild.wormholeChannel}>.\n` + 
                        `Are you sure you want to open a wormhole in <#${channel.id}> and close the existing wormhole at <#${guild.wormholeChannel}>?\n` +
                        "This will allow messages from other guilds to come in.");
                }


            } else {
                embed
                    .setTitle(`Confirmation opening wormhole in **${channel.name}**`)
                    .setDescription(`Are you sure you want to open a wormhole in <#${channel.id}>?\n`
                    + "This will allow messages from other guilds to come in.");
            }

            let msg = await message.respond(embed);
            msg.confirm();

            const moved = Kirito.channels.has(guild.wormholeChannel);

            msg.accept(() => {
                
                if (moved)
                Kirito.channels.get(guild.wormholeChannel).send({
                    embed:{
                        title:"The wormhole has been closed here!",
                        color: 0x0066ff
                }});

                guild.wormholeChannel = channel.id;
                Kirito.guilds_.set(guild.id,guild);
                delete embed.description;
                embed.setTitle(`Confirmed ${moved ? "moving" : "opening"} wormhole`);
                msg.edit(embed);
                Kirito.channels.get(channel.id).send({
                    embed:{
                        title:"A wormhole has been opened here!",
                        color: 0x0066ff
                }});

            });
            msg.deny(() => {
                delete embed.description;
                embed.setTitle(`Cancelled ${moved ? "moving" : "opening"} wormhole`)
                msg.channel.send(embed)
            });

        }

        //Close
        else if (args[0] === "close") {

            const guild = Kirito.guilds_.get(message.guild.id);

            if (!message.member.hasPermission("MANAGE_GUILD"))
                return message.respond("You don\'t have the manage_server permission!");
            
            if (!Kirito.channels.has(guild.wormholeChannel))
                return message.respond("There is no wormhole open in this server!");
            
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

        }

        //Neither open, send or close...
        else message.respond('That is not a valid argument. Take a look at this commands help:',Kirito.renderHelp(this.name))
    }
}

module.exports = Wormhole;