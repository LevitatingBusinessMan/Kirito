class Ping {
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
            "ownerOnly": true,
            "expectedArgs": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, prefix, send) {
        message.channel.send(":stopwatch: testing connection")
        .then(msg => msg.edit(`Ping: \`${msg.createdTimestamp - message.createdTimestamp}\` ms`));
    }
}

module.exports = Ping;