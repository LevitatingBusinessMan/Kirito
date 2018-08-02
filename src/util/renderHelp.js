module.exports = function (command, prefix) {
    if (command){
        if (typeof command === "string")
            command = this.commands[command] || this.commandAliases[command];
        
        prefix = prefix || this.config.prefix;

        let embed = new this.Discord.RichEmbed()
        .setTitle(command.name.capitalize())
        .setDescription(command.help.description)
        .addField("Usage:",command.help.usage.replace('[prefix]', prefix));
        
        if (command.conf.ownerOnly)
            embed.setTitle(command.name.capitalize() + " [Owner only]")

        let footer = "";

        if (command.conf.perms.length)
            footer += (`[Perms: ${command.conf.perms.join(', ').toLowerCase()}]   `);
    
        if (command.conf.aliases.length)
            footer += (`[Aliases: ${command.conf.aliases.join(', ')}]`);

        console.log(footer);
        embed.setFooter(footer);
        
        console.log(embed);
        return embed;
    }
    else {

    }
}