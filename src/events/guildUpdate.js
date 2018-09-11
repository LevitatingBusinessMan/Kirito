module.exports = async function guildUpdate (Kirito, [oldGuild,newGuild]) {
    //Update name of guild when changed
    let guild = Kirito.guilds_.get(oldGuild.id);
    guild.name = newGuild.name;
    Kirito.guilds_.set(guild.id, guild);
}
