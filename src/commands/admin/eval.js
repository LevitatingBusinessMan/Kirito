class Eval {
    constructor() {
        this.help = {
            "description": "Evaluate code",
            "usage": "[prefix]eval <code>"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": "*",
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        let toEval = args.join(' ');
        try {
            const {inspect} = require('util');
            let output = await eval(`(async () => {return ${toEval}})()`);
            chn.send(`Input:\`\`\`${toEval}\`\`\` Output \`\`\`${inspect(output).substr(0,1800)}\`\`\``);
        } catch(e) {
            chn.send(`Input:\`\`\`${toEval}\`\`\` Output \`\`\`${e.message}\`\`\``);
        }
    }
}

module.exports = Eval;
