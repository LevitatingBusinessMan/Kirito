const addEmojiConfirm = require("./addEmojiConfirm");
const addDestructor = require("./addDestructor");
const Kirito = require("../index")

module.exports = async function (content, options) {
    this.channel.stopTyping(true);
    let message = await this.channel.send(content,options);

    message.ogAuthorID = this.author.id;
    message.ogMessageID = this.id;

    message.confirm = addEmojiConfirm;
    message.destruct = addDestructor;

    return message;
}
