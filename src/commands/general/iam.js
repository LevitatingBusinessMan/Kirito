class Iam {
    constructor() {
        this.help = {
            "description":
`Assign an autorole to yourself or manage autoroles.
Autoroles are roles users can assign to themselves.

\`[prefix]iam\` to show the servers autoroles

For users:
\`[prefix]iam <role>\` to add a role to yourself
\`[prefix]iamnot <role>\` to remove a role to yourself

For moderators:
\`[prefix]iam -add <role>\` to add a role to the servers autoroles
\`[prefix]iam -delete <role>\` to remove a role to the servers autoroles

`,
            "usage": "[prefix]iam gay"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["autorole", "role", "iamnot"],
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

        const
            guild = Kirito.guilds_.get(message.guild.id),
            authority = message.member.hasPermission("MANAGE_ROLES");

        if (!message.guild.me.hasPermission("MANAGE_ROLES"))
            return message.respond("I don't have the permission to manage roles!");

        if (args.length) {
            
            //Add or remove role from user
            if (!["-add", "-delete"].includes(args[0])) {

                //No autoroles? Return
                if (!guild.autoroles.length) return message.respond("This guild has no autoroles set");

                const iamnot = (["-iamnot", "-remove"].includes(args[0]) || alias == "iamnot");

                //If flag is used the role is in the second arg
                const roleName = ["-iamnot", "-remove"].includes(args[0]) ? args[1] : args[0]

                if (!roleName)
                    return message.respond("Missing role name!");
                
                const role = message.guild.roles.find(r => r.name == roleName);

                if (!guild.autoroles.includes(roleName))
                    return message.respond("That role is not an autorole");
                
                if (!role) {
                    guild.autoroles.remove(roleName);
                    Kirito.guilds_.set(guild.id, guild);
                    return message.respond("That role doesn't exist anymore. Removing it from autoroles...");
                }

                //Remove role from user
                if (iamnot) {

                    if (!message.member.roles.has(role.id))
                        return message.respond("You don't have that role!");
                    
                    message.member.removeRole(role.id)
                    .then(() => message.respond(`Removed autorole **${role.name}** from you`))
                    .catch(() => message.respond(`:x: Something went wrong, maybe my permissions aren't set correctly?`))

                }

                //Add role to user
                else {

                    if (message.member.roles.has(role.id))
                        return message.respond("You already have that role!");
                    

                    const embed = new Kirito.Discord.RichEmbed()
                    .setTitle(`Add role: **${role.name}**`)
                    .addField("Seperated members list", role.hoist ? ":white_check_mark:":":x:")
                    .addField("Mentionable", role.mentionable ? ":white_check_mark:":":x:")

                    if (role.color) {
                        embed
                        .setColor(role.color)
                        .addField("Color", ":arrow_left: " + role.color);
                    }

                    const msg = await message.respond(embed);

                    msg.confirm()
                    .accept(() => {
                        message.member.addRole(role.id)
                            .then(() => message.respond(`Added autorole **${role.name}** to you`))
                            .catch(() => message.respond(`:x: Something went wrong, maybe my permissions aren't set correctly?`))
                    })
                    .deny(() => {
                        message.respond(`No autoroles have been added.`)
                    })

                }

            }
            
            //Change autoroles
            else {
                if(!authority)
                    return message.respond("You don\'t have the manage_roles permission!");

                if (!args[1])
                    return message.respond("Missing role name!");

                const role = message.guild.roles.find(r => r.name == args[1]);

                //Add role to server
                if (args[0] == "-add") {

                    //Possibility to create role
                    if (!role)
                        return message.respond("That role doesn't exist. \nDo you want to create it?").then(msg => {
                            msg.confirm()
                            .accept(() => {
                                message.guild.createRole({name: args[1]}, `Requested as autorole by ${message.author.id}`);
                                
                                guild.autoroles.push(args[1]);
                                Kirito.guilds_.set(guild.id, guild);

                                message.respond(new Kirito.Discord.RichEmbed()
                                .setTitle(`Created role and autorole **${args[1]}**`)
                                .setColor("GREEN")
                                .setFooter("This role is now public for anyone to use"));

                            })
                            .deny(() => {
                                msg.edit("That role doesn't exist.");
                                msg.clearReactions();
                            })
                        })
                    
                    if (guild.autoroles.includes(role.name))
                        return message.respond("A role with that name is already an autorole");

                    if (message.guild.roles.filter(r => r.name == args[1]).size > 1)
                        return message.respond("There are mulitple roles with that name in this server, this can cause issues in this version of this bot.\nPlease remove the duplicate(s)")

                    guild.autoroles.push(role.name);
                    Kirito.guilds_.set(guild.id, guild);
                    message.respond(new Kirito.Discord.RichEmbed()
                    .setTitle(`Added **${role.name}** to autoroles`)
                    .setColor("GREEN")
                    .setFooter("This role is now public for anyone to use"))
                }
                
                //Remove role from server
                else {

                    if (!guild.autoroles.includes(args[1]))
                        return message.respond("There is no autorole with that name");
                    
                    if (role) {
                        message.respond(
                            "By deleting the autorole, the role will still exist but won't be publicly available. \n" +
                            "Do you want me to remove this role from the server completely? \n\n" +
                            `Warning: This will remove the role from at least **${role.members.size}** users. \n`
                        ).then(msg => {
                            msg.confirm()
                            .accept(() => {

                                role.delete(`Removed by ${message.author.id}`)
                                .then(() => {
                                    guild.autoroles.remove(args[1]);
                                    Kirito.guilds_.set(guild.id, guild);
    
                                    message.respond(new Kirito.Discord.RichEmbed()
                                    .setTitle(`Removed role **${args[1]}** from server completely`)
                                    .setColor("RED"));
                                })
                                .catch(() => message.respond(`:x: Something went wrong, maybe my permissions aren't set correctly?`))

                            })
                            .deny(() => {
                                guild.autoroles.remove(args[1]);
                                Kirito.guilds_.set(guild.id, guild);

                                message.respond(new Kirito.Discord.RichEmbed()
                                .setTitle(`Removed role **${args[1]}** from autoroles only`)
                                .setColor("RED"));
                            })
                        })
                    }
                    else {
                        guild.autoroles.remove(args[1]);
                        Kirito.guilds_.set(guild.id, guild);
                        message.respond(new Kirito.Discord.RichEmbed()
                        .setTitle(`Removed **${args[1]}** from autoroles`)
                        .setColor("RED"))
                    }

                }

            }

        } 
        
        //No args, show autoroles
        else {
            if (guild.autoroles.length)
                message.respond(`Autoroles: ${guild.autoroles.join(", ")}`)
            else message.respond("This guild has no autoroles set")
        }

    }
}

module.exports = Iam;