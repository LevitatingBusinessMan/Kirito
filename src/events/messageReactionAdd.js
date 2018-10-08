module.exports = async function messageReactionAdd (Kirito, [messageReaction, user]) {
    if (!Kirito.savedMessages.has(messageReaction.message.id))
        return;
    
    let isEmojiConfirm = (messageReaction, user) => 
    (messageReaction.emoji.name === "✅" || messageReaction.emoji.name === "❌")
    && user.id === Kirito.savedMessages.get(messageReaction.message.id).message.ogAuthorID
    && Kirito.savedMessages.get(messageReaction.message.id).type === 'confirm';

    let isDestructor = (messageReaction, user) => 
    messageReaction.emoji.name === "🗑"
    && user.id === Kirito.savedMessages.get(messageReaction.message.id).message.ogAuthorID
    && Kirito.savedMessages.get(messageReaction.message.id).type === 'destructor';

    if (isEmojiConfirm(messageReaction, user)) {
        if (messageReaction.emoji.name === "✅")
            Kirito.savedMessages.get(messageReaction.message.id).message.acceptFN(messageReaction.message);
        if (messageReaction.emoji.name === "❌")
            Kirito.savedMessages.get(messageReaction.message.id).message.denyFN(messageReaction.message);
        Kirito.savedMessages.delete(messageReaction.message.id)
    }

    if (isDestructor(messageReaction, user)) {
        messageReaction.message.delete();
        let ogMessage = await messageReaction.message.channel.fetchMessage(messageReaction.message.ogMessageID)
        if (ogMessage && ogMessage.guild)
            ogMessage.delete();

        Kirito.savedMessages.delete(messageReaction.message.id)
    }
}
