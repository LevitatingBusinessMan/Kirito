module.exports = async function message (Kirito, [message]) {
    
    let prefix;
    if (!message.guild)
        prefix = Kirito.config.prefix;
    else
        prefix = Kirito.guilds_.get(message.guild.id).prefix || Kirito.config.prefix;
    
    if (message.content.startsWith(prefix) || message.content.startsWith(`<@${Kirito.user.id}>`)) {
        if (message.author.bot)
            return;

        let messageExPrefix;
        if (message.content.startsWith(prefix))
            messageExPrefix = message.content.substr(prefix.length);
        if (message.content.startsWith(`<@${Kirito.user.id}>`))
            messageExPrefix = message.content.substr(`<@${Kirito.user.id}>`.length);
        
        const args = messageExPrefix.trim().split(/\s/g).map(x => x.trim()).filter(x => x.length);

        let commandName = args.shift().toLowerCase();
        if (Kirito.commands[commandName] || Kirito.commandAliases[commandName]) {
            command = Kirito.commands[commandName] || Kirito.commandAliases[commandName];

            //Command disabled
            if (command.conf.disabled)
                return message.channel.send(disabled);

            //NSFW
            if (command.conf.nsfw && !message.channel.nsfw)
                return message.channel.send(nsfw);

            //Guild only
            if (!message.guild && command.conf.guildOnly)
                return message.channel.send(guildOnly);

            //Admin category
            if (command.category == 'admin' && !Kirito.config.admins.includes(message.author.id))
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
                
                //SameVC
                if (Kirito.manager.players.has(message.guild.id) && message.member.voiceChannel && command.conf.sameVC)
                    if (message.member.voiceChannel.id !== message.guild.me.voiceChannel.id)
                        return message.channel.send(sameVC);
            }
            
            //Match args with expected
            if (command.conf.expectedArgs.length) {
                //Old STR/INT system
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
            //Regex system
            else if (typeof command.conf.expectedArgs === "object") {
                if (!args.length)
                    return message.channel.send(missingArgs, Kirito.renderHelp(command));
                if (!command.conf.expectedArgs.test(args.join(' ')))
                    return message.channel.send(invalidArgs.replace('%s',args.join(', ')), Kirito.renderHelp(command))
            }

            //Ensure user is in DB
            if (!Kirito.users_.has(message.author.id))
                Kirito.users_.set(message.author.id, Kirito.userEntry(message.author));
            
            //Alias used
            let alias = false;
            if (Kirito.commandAliases[commandName])
                alias = commandName;

            message.respond = require(require('path').join(__dirname, '../util/messageRespond'))(Kirito);

            try {
                await command.run(Kirito, args, message, alias, prefix, message.channel);
            } catch(e) {
                Kirito.log('err', e.stack);
                if (Kirito.Raven)
                    Kirito.Raven.captureException(e);
                message.channel.send(errorMessage);
            }

        //Command not recognized
        } else {
            Kirito.savedMessages.set(message.id, {type:'edit',message});
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
sameVC = ":x: You are not in the same voice channel!",
nsfw = ":x: This channel isn't nsfw!"
errorMessage = ":x: Oops! An error occured";