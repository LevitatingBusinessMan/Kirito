module.exports = function message (Kirito, [message]) {

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
            args = message.content.substr(prefix.length).split(/\s/g);
        if (message.content.startsWith(`<@${Kirito.user.id}>`))
            args = message.content.substr(`<@${Kirito.user.id}>`.length).split(/\s/g);
        
        let command = args.shift();
        if (Kirito.commands[command] || Kirito.commandAliases[command]) {
            command = Kirito.commands[command] || Kirito.commandAliases[command];

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
            
            //Ensure user is in DB
            if (!Kirito.users_.has(message.author.id))
                Kirito.users_.set(message.author.id, Kirito.userEntry(message.author));
            
            command.run(Kirito, args, message, prefix);

        } else {
            //Edit messages stuff
        }
    }
}

const
insufficientPerms = ":x: You don't have the required permissions to use this command.\nMissing permission(s): ",
guildOnly = ":x: This command cannot be used in DM",
ownerOnly = ":x: This command is for owners only",
adminOnly = ":x: This command is for administrators of Kirito only"
disabled = ":x: This command has been disabled";