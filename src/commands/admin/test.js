class Test {
    constructor() {
        this.help = {
            "description": "Command for testing",
            "usage": "[prefix]test"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": false,
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
    }
}

module.exports = Test;