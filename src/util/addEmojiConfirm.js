const Kirito = require("../index")

module.exports = function() {
    this.react('✅').then(() => this.react('❌'));
    
    let accept = (fn) => {
        this.acceptFN = fn;
        Kirito.savedMessages.set(this.id, {type:'confirm',message:this});
        return {deny};
    }

    let deny = (fn) => {
        this.denyFN = fn;
        Kirito.savedMessages.set(this.id, {type:'confirm',message:this});
        return {accept};
    }
    
    //Timeout
    setTimeout(() => {
        if (Kirito.savedMessages.has(this.id)) {
            if (Kirito.savedMessages.get(this.id).message.denyFN)
                Kirito.savedMessages.get(this.id).message.denyFN(Kirito.savedMessages.get(this.id));
            Kirito.savedMessages.delete(this.id);
        }
    }, 15000)

    this.accept = accept;
    this.deny = deny;

    return {
        deny,
        accept
    };
}