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
            let output = args.includes('await') ? await eval(toEval) : eval(toEval);
            chn.send(`Input:\`\`\`${toEval}\`\`\` Output \`\`\`${output}\`\`\``);
        } catch(e) {
            chn.send(`Input:\`\`\`${toEval}\`\`\` Output \`\`\`${e.message}\`\`\``);
        }
    }
}

module.exports = Eval;
