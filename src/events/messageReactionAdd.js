module.exports = function messageReactionAdd (Kirito, [messageReaction, user]) {
    if (!Kirito.savedMessages.has(messageReaction.message.id))
        return;
    
    let isEmojiConfirm = (messageReaction, user) => 
    (messageReaction.emoji.name === "✅" || messageReaction.emoji.name === "❌")
    && user.id === Kirito.savedMessages.get(messageReaction.message.id).message.ogAuthorID
    && Kirito.savedMessages.get(messageReaction.message.id).type === 'confirm';

    if (isEmojiConfirm(messageReaction,user)) {
        if (messageReaction.emoji.name === "✅")
            Kirito.savedMessages.get(messageReaction.message.id).message.accept();
        if (messageReaction.emoji.name === "❌")
            Kirito.savedMessages.get(messageReaction.message.id).message.deny();
        Kirito.savedMessages.delete(messageReaction.message.id)
    }
}
