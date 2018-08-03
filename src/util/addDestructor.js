module.exports = Kirito => {
    return function() {
        this.react("🗑");
        Kirito.savedMessages.set(this.id, {type:'destructor',message:this});
    }
}