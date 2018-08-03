class Guildsettings {
    constructor() {
        this.help = {
            "description": "Shows all guilds' settings",
            "usage": "[prefix]guildsettings"
        }
        this.conf = {
            "disabled": true,
            "aliases": [],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        let guild = Kirito.guilds_.get(message.guild.id);
    }
}

module.exports = Guildsettings;