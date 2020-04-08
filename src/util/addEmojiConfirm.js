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
    Kirito.wait(15000, () => {
        if (Kirito.savedMessages.has(this.id)) {
            if (Kirito.savedMessages.get(this.id).message.denyFN)
                Kirito.savedMessages.get(this.id).message.denyFN(Kirito.savedMessages.get(this.id));
            Kirito.savedMessages.delete(this.id);
        }
    })

    this.accept = accept;
    this.deny = deny;

    return {
        deny,
        accept
    };
}