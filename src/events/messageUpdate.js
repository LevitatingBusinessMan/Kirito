module.exports = async function messageUpdate (Kirito, [oldMessage, newMessage]) {
    if (Kirito.savedMessages.has(oldMessage.id))
        if (Kirito.savedMessages.get(oldMessage.id).type === 'edit')
            if((await newMessage.channel.fetchMessages({limit:1, after:newMessage.id})).size < 1) {
                Kirito.emit('message', newMessage);
                Kirito.savedMessages.delete(newMessage.id)
            }
}
