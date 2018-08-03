module.exports = Kirito => {
    return function() {
        this.react('✅').then(() => this.react('❌'));
        
        let accept = (fn) => {
            this.accept = fn;
            Kirito.savedMessages.set(this.id, {type:'confirm',message:this});
            return {deny};
        }

        let deny = (fn) => {
            this.deny = fn;
            Kirito.savedMessages.set(this.id, {type:'confirm',message:this});
            return {accept};
        }

        return {
            deny,
            accept
        };
    }
}