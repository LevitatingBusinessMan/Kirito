class Ping {
    constructor() {
        this.help = {
            "description": "Command example",
            "usage": "[prefix] command"
        }
        this.conf = {
            "disabled": false,
            "aliases": ['test'],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": false
        }
    }
    async run(client, args, message, prefix, send) {
        send(":stopwatch: testing connection")
        .then(msg => msg.edit(`Ping: \`${msg.createdTimestamp - message.createdTimestamp}\` ms`));
    }
}

module.exports = Ping;