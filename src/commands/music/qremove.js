class Qremove {
    constructor() {
        this.help = {
            "description": "Remove a specific listing from the queue",
            "usage": "[prefix]qremove 4"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["qr"],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": "int",
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (Kirito.manager.players.has(message.guild.id)) {
            let player = Kirito.manager.players.get(message.guild.id);
            if (!player.queue.length)
                return message.respond({embed:{title:"Queue is empty!",footer:{text:`Use: \`${prefix}qa\` to add a song to the queue`}}});
            if (player.queue[args[0]-1]) {
                message.respond(`Removed: \`${player.queue.splice(args[0]-1,1)[0].info.title}\``);
            } else message.respond(`There is no listing with index \`${args[0]}\` in the queue!`)
        } else message.respond("There is no active queue!");
    }
}

module.exports = Qremove;