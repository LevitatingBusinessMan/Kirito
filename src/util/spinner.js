class Spinner {
    constructor(string, speed, spinner) {
        spinner = spinner.split("") || "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏".split("");

        let i = 0;
        this.interval = setInterval(() => {
            process.stdout.cursorTo(0);
            process.stdout.write(string.replace("%s", spinner[i]));
            if (i < spinner.length-1)
                i++;
            else i = 0;
        }, speed);
    }
    stop() {
        clearInterval(this.interval);
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
    }
};

module.exports = Spinner;
