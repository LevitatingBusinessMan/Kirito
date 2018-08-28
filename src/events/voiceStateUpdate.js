module.exports = async function voiceStateUpdate (Kirito, [oldMember,newMember]) {
    if (!Kirito.config.lavaLinkNode)
        return;
    Kirito.wait(30000, () => {
        if (Kirito.manager.players.has(oldMember.guild.id)) {
            let player = Kirito.manager.players.get(oldMember.guild.id);
            let channel = Kirito.channels.get(player.channel);
            if (channel.members.size < 2) {
                Kirito.manager.leave(oldMember.guild.id);
                Kirito.manager.players.delete(oldMember.guild.id);
            }
        }
    });
}
