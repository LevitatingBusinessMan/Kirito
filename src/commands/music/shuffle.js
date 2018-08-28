class Shuffle {
    constructor() {
        this.help = {
            "description": "Shuffle the queue",
            "usage": "[prefix]shuffle"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
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
                return message.respond({embed:{title:"Queue is empty!",footer:{text:`Use: \`${prefix}qa\` to add a song to the queue`}}});
            player.queue.shuffle();
            message.respond(":twisted_rightwards_arrows:: Shuffled the queue!")
        } else message.respond("There is no active queue!");
    }
}

module.exports = Shuffle;