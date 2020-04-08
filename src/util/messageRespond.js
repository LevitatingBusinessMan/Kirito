const addEmojiConfirm = require("./addEmojiConfirm");
const addDestructor = require("./addDestructor");

module.exports = Kirito => {
    return async function (content, options) {
        this.channel.stopTyping(true);
        let message = await this.channel.send(content,options);

        message.ogAuthorID = this.author.id;
        message.ogMessageID = this.id;

        message.confirm = addEmojiConfirm;
        message.destruct = addDestructor;

        return message;
    }
}