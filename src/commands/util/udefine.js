class Udefine {
    constructor() {
        this.help = {
            "description": "Search for a definition in Urban Dictionary",
            "usage": "[prefix]udefine the batman"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["udef", "urban", "define"],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": "str",
            "sameVC": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        
        const axios = require("axios");

        const result = await axios.get(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(args.join(' '))}`);

        if (!result.data)
            return message.channel.respond(":x: an error occurred");

        if (!result.data.list[0])
            return message.channel.respond(":x: No definitions found");

        const firstResult = result.data.list[0];
        return message.respond({
            embed: {
                color: 0xff8040,
                title: `${args.join(" ")} results`,
                url: firstResult.permalink,
                fields: [{
                    name: "**Definition:**",
                    value: firstResult.definition.length > 1000 ? firstResult.definition.substr(0, 990) + '...' : firstResult.definition
                }, {
                    name: "**Example:**",
                    value: '*' + firstResult.example + '*'
                }, {
                    name: "**Author:**",
                    value: firstResult.author
                }],
                footer: {
                    text: `👍${firstResult.thumbs_up} | ${firstResult.thumbs_down}👎`
                },
                timestamp: new Date()
            }
        });

    }
}

module.exports = Udefine;