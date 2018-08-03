module.exports = async function guildCreate (Kirito, [guild]) {
    //Add new guild to DB
    Kirito.guilds_.set(guild.id, Kirito.guildEntry(guild));


    if (Kirito.config.logChannel)
        Kirito.channels.get(Kirito.config.logChannel).send('Joined guild:', 
        new Kirito.Discord.RichEmbed()
        .setTitle(guild.name)
        .setDescription(guild.id)
        .setThumbnail(guild.iconURL)
        .setColor(0x00ff00)
        .addField("Members:",guild.members.size,true)
        .addField("Bots:",guild.members.array().filter(x => x.user.bot).length,true)
        .setTimestamp(new Date())
        .setFooter(guild.owner.user.tag,guild.owner.user.avatarURL)
    );
}
