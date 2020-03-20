class Eval {
    constructor() {
        this.help = {
            "description": "Evaluate code",
            "usage": "[prefix]eval <code>"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["e"],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": "*",
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        let toEval = args.join(' ').replace(/;\s?/g, ';\n').replace(/{\s?/g,'{\n').replace(/}\s?/g,'}\n');
        try {
            const {inspect} = require('util');
            
            let output = await eval(`(async () => {${toEval.includes("return")?'':"return"} ${toEval}})()`);
            var msg = await message.respond(`Input:\`\`\`JS\n${toEval}\`\`\` Output \`\`\`JS\n${inspect(output).substr(0,1900)}\`\`\``);
        } catch(e) {
            var msg = await message.respond(`Input:\`\`\`JS\n${toEval}\`\`\` Output \`\`\`JS\n${e.message}\`\`\``);
            if (Kirito.debug)
                Kirito.logger.error(e);
        }
        msg.destruct();
    }
}

module.exports = Eval;
