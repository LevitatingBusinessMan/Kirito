Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.remove = function(value) {
    let i = this.indexOf(value);
    if (i < 0)
        throw new Error(`Value ${value} not found in array!`)

    this.splice(i,1);
}

Array.prototype.last = function(){
    return this[this.length - 1];
};

Array.prototype.shuffle = function(){
    let array = this;
    for (i=array.length; i > 0;){
        let t = Math.floor(Math.random() * i--);
        let o = array[i];
        array[i] = array[t];
        array[t] = o;
    }
    return array;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.between = function (begin, end) {
    let startIndex = 0;
    if (begin) startIndex = this.indexOf(begin) + begin.length;
    return this.substring(startIndex, end ? this.lastIndexOf(end) : undefined);
}
