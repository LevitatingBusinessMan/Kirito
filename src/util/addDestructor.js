const Kirito = require("../index")

module.exports = function () {
    this.react("🗑");
    Kirito.savedMessages.set(this.id, {type:'destructor',message:this});
}
