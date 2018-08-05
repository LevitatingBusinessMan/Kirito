class Prefix {
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
            "expectedArgs": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (!message.guild)
            message.respond("Default prefix: " + Kirito.config.prefix);
        else {
            if (args[0])
                if (message.member.hasPermission("MANAGE_GUILD")) {
                    let guild = Kirito.guilds_.get(message.guild.id);
                    guild.prefix = args[0];
                    Kirito.guilds_.get(message.guild.id, guild);
                    message.respond(`new prefix: \`${args[0]}\``);
                }
                else message.respond("You don't have the manage_server permission!");
            else {
                let guildPrefix = Kirito.guilds_.get(message.guild.id).prefix;
                message.respond(`Current prefix: \`${guildPrefix ? guildPrefix : Kirito.config.prefix}\``);
            }
        }
    }
}

module.exports = Prefix;