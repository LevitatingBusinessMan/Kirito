class Loop {
    constructor() {
        this.help = {
            "description": "When enabled finished songs will end back in queue",
            "usage": "[prefix]loop"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["repeat"],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
if (Kirito.manager.players.has(message.guild.id)) {
            let player = Kirito.manager.players.get(message.guild.id);
            if (player.loop) {
                player.loop = false;
                message.respond(':arrow_right:: Disabled loop')
            } else {
                player.loop = true;
                message.respond(':repeat:: Enabled loop')
            }
        } else message.respond("There is no player!");
    }
}

module.exports = Loop;