module.exports = async function messageUpdate (Kirito, [oldMessage, newMessage]) {
    if (Kirito.editMessages.has(oldMessage.id)) {
        if((await newMessage.channel.fetchMessages({limit:1, after:newMessage.id})).size < 1) {
            Kirito.emit('message', newMessage);
            Kirito.editMessages.delete(newMessage.id)
        }
    }
}
