module.exports = function (command, prefix) {
    //Specific command
    if (command){
        if (typeof command === "string")
            command = this.commands[command] || this.commandAliases[command];
        
        prefix = prefix || this.config.prefix;

        let embed = new this.Discord.RichEmbed()
        .setTitle(command.name.capitalize())
        .setDescription(command.help.description.replace('[prefix]', prefix))
        .addField("Usage:",command.help.usage.replace('[prefix]', prefix));
        
        if (command.conf.ownerOnly)
            embed.setTitle(command.name.capitalize() + " [Owner only]")
        
        if (command.category == 'admin')
            embed.setTitle(command.name.capitalize() + " [Admin only]")

        let footer = "";

        if (command.conf.perms.length)
            footer += (`[Perms: ${command.conf.perms.join(', ').toLowerCase()}]   `);
    
        if (command.conf.aliases.length)
            footer += (`[Aliases: ${command.conf.aliases.join(', ')}]`);

        embed.setFooter(footer);

        return embed;
    }
    //All commands
    else {
        let categories = {};
        for (var command in this.commands) {
            let category = this.commands[command].category.capitalize();
            if (category != 'admin') {
                if (!categories[category])
                    categories[category] = [];
                if (!this.commands[command].conf.disabled || this.commands[command].conf.disabled && this.config.show_disabled)
                    categories[category].push(command);
            }
        }

        let embed = new this.Discord.RichEmbed()
        .setTitle(this.user.username)
        .setThumbnail(this.user.avatarURL);
        for (var category in categories){
            embed.addField(category, categories[category].join(', '));
        }
        
        embed.withoutAdmin = function() {
            this.fields = this.fields.filter(field => field.name !== "Admin");
            return this;
        }

        return embed;
    }
}