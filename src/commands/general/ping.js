class Ping {
    constructor() {
        this.help = {
            "description": "Test the RTT (round-trip-time) of Kirito's connection with the Discord API",
            "usage": "[prefix]ping"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["pong"],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        message.respond(":stopwatch: testing connection")
        .then(msg => msg.edit(`Ping: \`${msg.createdTimestamp - message.createdTimestamp}\` ms`));
    }
}

module.exports = Ping;