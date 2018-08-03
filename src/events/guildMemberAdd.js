module.exports = async function guildMemberAdd (Kirito, [member]) {
    let guild = Kirito.guilds_.get(member.guild.id);
    if(guild.greeting) {
        if (Kirito.channels.has(guild.messageChannel)){
            Kirito.channels.get(guild.messageChannel).send(
            guild.greeting
            .replace("%user%", member.user.username)
            .replace("%user-tag%", member.user.tag)
            .replace("%mention%", `<@${member.user.id}>`)
            .replace("%server%", member.guild.name)
            .replace("%guild%", member.guild.name)
            );
        }
        else {
            guild.messageChannel = null;
            Kirito.guilds_.set(guild.id, guild);
        }
    }
}
