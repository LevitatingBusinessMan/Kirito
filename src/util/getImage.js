//In the future these might have to be replace with axios instances (authorization etc)
const RemAPI = "https://rra.ram.moe/i/r?type=%s";
const CFsAPI = "https://api.computerfreaker.cf/v1/%s";

/**
 * @param {String} type The requested image type
 * @param {GuildMember} author
 * @param {String} receiver Mention, id or username
 */
module.exports = async function (type, author, receiver) {
    switch (type){
        case "slap":
            var color = 0xff0000;
            var verb = "slapped";
            var api = RemAPI;
            break;
        case "cry":
            var color =  0x4ddbff;
            var verb = null;
            var api = RemAPI;
            break;
        case "cuddle":
            var color =  0xe60073;
            var verb = "cuddled";
            var api = RemAPI;
            break;
        case "hug":
            var color =  0xe60073;
            var verb = "hugged";
            var api = RemAPI;
            break;
        case "kiss":
            var color =  0xe60073;
            var verb = "hugged";
            var api = RemAPI;
            break;
        case "lick":
            var color =  0x007acc;
            var verb = "licked";
            var api = RemAPI;
            break;
        case "nom":
            var color =  0x663300;
            var verb = null;
            var api = RemAPI;
            break;
        case "pat":
            var color =  0xe60073;
            var verb = "patted";
            var api = RemAPI;
            break;
        case "rem":
            var color = 0x0099ff;
            var verb = null;
            var api = RemAPI;
            break;
        case "tickle":
            var color = 0x0099ff;
            var verb = "tickled";
            var api = RemAPI;
        case "hentai":
            var api = CFsAPI;
    }
    
    let {data} = await this.axios(api.replace("%s",type));

    switch (api) {
        case RemAPI:
            var image = "https://rra.ram.moe"+data.path;
            break;
        case CFsAPI:
            var image = data.url;
    }
    
    let embed = new this.Discord.RichEmbed()
    .setImage(image)
    .setColor(color);

    if (author && receiver && verb) {
        let {user} = this.getUser(receiver,author.guild.members);
        if (!user)
            embed = 'User not found!';
        else 
            embed.setDescription(`**${author.user.username}** ${verb} **${user.username}**!`);
    }
        
    return embed;
}