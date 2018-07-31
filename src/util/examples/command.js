class Command {
    constructor() {
        this.help = {
            "description": "Command example",
            "usage": "[prefix] command"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": false
        }
    }
    async run(client, args, message, prefix, send) {

    }
}

module.exports = Command;