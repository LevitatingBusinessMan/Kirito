module.exports = async function guildDelete (Kirito, [guild]) {
    Kirito.guilds_.delete(guild.id);

    if (Kirito.config.logChannel)
        Kirito.channels.get(Kirito.config.logChannel).send('Left guild:', 
        new Kirito.Discord.RichEmbed()
        .setTitle(guild.name)
        .setDescription(guild.id)
        .setThumbnail(guild.iconURL)
        .setColor(0xff0000)
        .addField("Members:",guild.members.size,true)
        .addField("Bots:",guild.members.array().filter(x => x.user.bot).length,true)
        .setTimestamp(new Date())
        .setFooter(guild.owner.user.tag,guild.owner.user.avatarURL)
    );
}
