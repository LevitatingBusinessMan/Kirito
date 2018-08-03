class Help {
    constructor() {
        this.help = {
            "description": "Show all commands or a specific command",
            "usage": "[prefix]help command"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": "",
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if(args[0]){
            let command = args[0].toLowerCase();
            if (Kirito.commands[command] || Kirito.commandAliases[command])
                message.respond(Kirito.renderHelp(command));
            else {
                const StringSimilarity = require('string-similarity');
                let ratings = StringSimilarity.findBestMatch(command, Object.keys(Kirito.commands)).ratings;
                let similiarCommands = [];
                for (let i = 0; i < ratings.length; i++) {
                    const result = ratings[i];
                    if (result.rating > 0.5)
                        similiarCommands.push(result.target)
                }
                if (similiarCommands.length)
                    message.respond(`Command \`${args[0]}\` not found.\n Similar commands: \`${similiarCommands.join(', ')}\``);
                else message.respond(`Command \`${args[0]}\` not found.`)
            }
        }
        else message.respond(
        Kirito.config.admins.includes(message.author.id) ?
            Kirito.renderHelp() :
            Kirito.renderHelp().withoutAdmin()
        );
    }
}

module.exports = Help;
