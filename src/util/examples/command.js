class Command {
    constructor() {
        this.help = {
            "description": "Command example",
            "usage": "[prefix]command"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": false,
            "sameVC": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        //Code to run
    }
}

module.exports = Command;