class Clear {
    constructor() {
        this.help = {
            "description": "Clear the queue",
            "usage": "[prefix]clear"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["cq"],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": false,
            "sameVC": true,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (Kirito.manager.players.has(message.guild.id)) {
            let player = Kirito.manager.players.get(message.guild.id);
            if (!player.queue.length)
                return message.respond({embed:{title:"Queue is already empty!",footer:{text:`Use: \`${prefix}qa\` to add a song to the queue`}}});
            (await message.respond({embed:{title:"Clear queue",color:0xff6600,description:`Are you sure you want to remove all \`${player.queue.length}\` songs from the queue?`}}))
            .confirm()
            .accept(msg => {msg.edit({embed:{title:"Cleared queue",color:0x00ff00}});player.queue = [];})
            .deny(msg => msg.edit({embed:{title:"Cancelled clearing queue",color:0x00ff00}}));
        } else message.respond("There is no active queue!");
    }
}

module.exports = Clear;