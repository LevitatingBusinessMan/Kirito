const path = require('path');

module.exports = Kirito => {
    return async function (content, options) {
        let message = await this.channel.send(content,options);

        message.ogAuthorID = this.author.id;

        message.confirm = require(path.join(__dirname,'./addEmojiConfirm'))(Kirito);

        return message;
    }
}