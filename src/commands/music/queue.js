class Queue {
    constructor() {
        this.help = {
            "description": "Show the current play queue",
            "usage": "[prefix]queue"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["q"],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": "",
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (Kirito.manager.players.has(message.guild.id)) {
            let {queue, loop} = Kirito.manager.players.get(message.guild.id);
            if (!queue.length)
                return message.respond({embed:{title:"Queue is empty!",footer:{text:`Use: \`${prefix}qa\` to add a song to the queue`}}});
            else {
                let list = [];
                for (let i = 0; i < queue.length && list.join("\n").length < 2048; i++) {
                    const {info:{title}} = queue[i];
                    list.push(`\`${i+1}\` ${title}`);
                }
                if (list.join("\n").length > 2048) {
                    let msg = `\nAnd ${queue.length - list.length} more...`;
                    list = list.join("\n").substring(0, 2048-msg.length) + msg;
                } else list = list.join("\n");
                message.respond(new Kirito.Discord.RichEmbed().setTitle(loop?'Queue :repeat:':'Queue').setDescription(list));
            }
        } else message.respond("There is no active queue!");
    }
}

module.exports = Queue;