module.exports = async function message (Kirito, [message]) {

    let prefix;
    if (!message.guild)
        prefix = Kirito.config.prefix;
    else
        prefix = Kirito.guilds_.get(message.guild.id).prefix || Kirito.config.prefix;
    
    if (message.content.startsWith(prefix) || message.content.startsWith(`<@${Kirito.user.id}>`)) {
        if (message.author.bot)
            return;

        let args;
        if (message.content.startsWith(prefix))
            args = message.content.substr(prefix.length).trim().split(/\s/g);
        if (message.content.startsWith(`<@${Kirito.user.id}>`))
            args = message.content.substr(`<@${Kirito.user.id}>`.length).trim().split(/\s/g);
        
        let commandName = args.shift().toLowerCase();
        if (Kirito.commands[commandName] || Kirito.commandAliases[commandName]) {
            command = Kirito.commands[commandName] || Kirito.commandAliases[commandName];

            //Command disabled
            if (command.conf.disabled)
                return message.channel.send(disabled);

            //Guild only
            if (!message.guild && command.conf.guildOnly)
                return message.channel.send(guildOnly);

            //Admin catagory
            if (command.catagory == 'admin' && !Kirito.config.admins.includes(message.author.id))
                return message.channel.send(adminOnly);

            //Required permissions
            if (!command.conf.perms.every(perm => message.member.hasPermission(perm)))
                return message.channel.send(insufficientPerms + command.conf.perms.filter(perm => !message.member.hasPermission(perm)).join(', '));

            if (message.guild) {
                //Owner only
                if (message.author.id != message.guild.ownerID && command.conf.ownerOnly)
                    return message.channel.send(ownerOnly);

                //No send_messages permission
                if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
                    return message.author.send('I am not authorized to speak in that channel, sorry!');
            }
            
            //Match args with expected
            if (command.conf.expectedArgs.length) {
                let expectedArgs = command.conf.expectedArgs.split(/\s/g);
                for (let i = 0; i < expectedArgs.length; i++) {
                    if (!args[i])
                        return message.channel.send(missingArgs, Kirito.renderHelp(command));
                    if (expectedArgs[i] !== '*') {
                        if (!isNaN(args[i]))
                            args[i] = parseInt(args[i]);
                        let type;
                        switch (expectedArgs[i]) {
                            case "str":
                                type = "string";
                                break;
                            case "int":
                                type = "number";
                                break;
                            default:
                                Kirito.log('warn',`Invalid expected args at command: ${command.name}`)
                        };
                        if (typeof args[i] !== type)
                            return message.channel.send(invalidArgs.replace('%s',args.join(', ')), Kirito.renderHelp(command))
                    }
                }
            }

            //Ensure user is in DB
            if (!Kirito.users_.has(message.author.id))
                Kirito.users_.set(message.author.id, Kirito.userEntry(message.author));
            
            //Alias used
            let alias = false;
            if (Kirito.commandAliases[commandName])
                alias = commandName;

            try {
                await command.run(Kirito, args, message, alias, prefix, message.channel);
            } catch(e) {
                Kirito.log('err', e.stack);
                message.channel.send(errorMessage);
            }
        } else {
            //Edit messages stuff
        }
    }
}

const
insufficientPerms = ":x: You don't have the required permissions to use this command.\nMissing permission(s): ",
guildOnly = ":x: This command cannot be used in DM",
ownerOnly = ":x: This command is for owners only",
adminOnly = ":x: This command is for administrators of Kirito only",
invalidArgs = ":x: The arguments `%s` are invalid for this command. Take a look at this commands help:",
missingArgs = ":x: Missing arguments. Take a look at this commands help:",
disabled = ":x: This command has been disabled",
errorMessage = ":x: Oops! An error occured";