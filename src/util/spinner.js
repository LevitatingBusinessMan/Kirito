require('draftlog').into(console)

class Spinner {
    constructor(string, speed, spinner) {
        this.string = string;
        this.speed = speed;

        this.spinner = spinner ? spinner.split("") : "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏".split("");
        this.update = console.draft(string.replace("%s", this.spinner[0]));

        let i = 1;
        this.interval = setInterval(() => {
            this.update(string.replace("%s", this.spinner[i]));
            if (i < this.spinner.length-1)
                i++;
            else i = 0;
        }, this.speed);
    }

    stop(replacement) {
        clearInterval(this.interval);
        this.update(replacement);
    }

    change(string, speed, spinner) {
        if (string)
            this.string = string;

        if (speed)
            this.speed = speed;
        
        if (spinner)
            this.spinner = spinner.split("");
    }
};

module.exports = Spinner;
