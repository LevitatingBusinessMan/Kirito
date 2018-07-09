class prompt {
    constructor(name) {
        this.name = name;
        this.cmd = {};
    }
    openNew() {
        process.stdout.write(`<${this.name}>`);
        
        process.stdin.addListener("data", d => {
            let args = d.toString().split(" ").map(e => e.trim());

            if(!args[0]) {
                process.stdout.write(`<${this.name}>`);
                return;
            }

            if (this.cmd[args[0]])
                this.cmd[args[0]](args.slice(1));
            else console.log(`Command ${args[0]} not found`);

            process.stdout.write(`<${this.name}>`);
        });
    }
    addCommand(fn) {
        this.cmd[fn.name] = fn;
    }
}

module.exports = prompt;
