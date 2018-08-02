const {get} = require("axios");
const RemAPI = "https://rra.ram.moe/i/r?type=%s"

//author is guildmember, receiver is mention, id or username
module.exports = async function (type, author, receiver) {
    switch (type){
        case "slap":
            var color = 0xff0000;
            var verb = "slapped";
            var api = RemAPI;
    }

    let {data} = await get(api.replace("%s",type));
    switch (api) {
        case RemAPI:
            var image = "https://rra.ram.moe"+data.path;
    }
    
    let embed = new this.Discord.RichEmbed()
    .setImage(image)
    .setColor(color);

    if (author && receiver) {
        let {user} = this.getUser(receiver,author.guild.members);
        if (!user)
            embed = 'User not found!';
        else 
            embed.setDescription(`**${author.user.username}** ${verb} **${user.username}**!`);
    }
        
    return embed;
}