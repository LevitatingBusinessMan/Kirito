const path = require('path');

module.exports = Kirito => {
    return async function (content, options) {
        this.channel.stopTyping(true);
        let message = await this.channel.send(content,options);

        message.ogAuthorID = this.author.id;
        message.ogMessageID = this.id;

        message.confirm = require(path.join(__dirname,'./addEmojiConfirm'))(Kirito);
        message.destruct = require(path.join(__dirname,'./addDestructor'))(Kirito);

        return message;
    }
}