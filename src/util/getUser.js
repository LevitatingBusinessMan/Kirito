//Get userID from mention, id or name
module.exports = function (user, collection) {
    user.trim();
    if (isNaN(user)) {
        //Check if mention
        if (/<@!?\d*>/.test(user)) {
            let id = user.replace(/<|@|!|>/g,"").trim();
            if (collection.has(id)) return collection.get(id);
            else return false;
        }
        //username
        else {
            const stringSimilarity = require("string-similarity");
            let nameType;
            let arr = collection.array().map(x => {
                //If collection is guildMembers, search is still done on usernames
                if (x.displayName) {nameType = null; return x.user.username;}
                if (x.username) {nameType = "username"; return x.username;}
                if (x.name) {nameType = "name"; return x.name;}
                return name;
            });

            let match = stringSimilarity.findBestMatch(user, arr).bestMatch;
            if (match.rating < 0.2)
                return false;
            else return collection.find(x => (nameType ? x[nameType] : x.user.username) === match.target);
        }
        
    }
    //ID
    else 
        if (collection.has(user)) return collection.get(user);
        else return false;
}

