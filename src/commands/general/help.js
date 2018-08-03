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
            if (Kirito.commands[args[0]] || Kirito.commandAliases[args[0]])
                message.respond(Kirito.renderHelp(args[0]));
            else {
                const StringSimilarity = require('string-similarity');
                let ratings = StringSimilarity.findBestMatch(args[0], Object.keys(Kirito.commands)).ratings;
                let similiarCommands = [];
                for (let i = 0; i < ratings.length; i++) {
                    const result = ratings[i];
                    if (result.rating > 0.3)
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
