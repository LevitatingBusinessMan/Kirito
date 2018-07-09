const chalk = require("chalk");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const readline = require('readline');

class Logger {
    constructor(logDirectory) {
        this.log_ = "";
        this.logFile = dayjs().format("(D-M-D) HH[h]-mm[m]-ss[s]") + ".txt";

        console.log = (d) => {
            process.stdout.clearLine();
            process.stdout.write(d + "\n");
        
            this.log_ += d + "\n";

            if (logDirectory) {
                if (!fs.existsSync(logDirectory))
                    fs.mkdirSync(logDirectory);
                // "/\[\d*m/g" replaces chalk colors
                // eslint-disable-next-line no-control-regex
                fs.writeFileSync(path.join(logDirectory, this.logFile), this.log_.replace(/\[\d*m/g, ""));
            }
        };
        console.error = console.log;
    }
    //Logging messages to console
    log(type, msg) {
        type = type.toUpperCase();

        let time = dayjs().format("HH:mm:ss");

        let stamp = `${type} ${time}`;
        switch (type) {
        case "OK":
            stamp = chalk.green(`${type} ${time}`);
            break;
        case "WARN":
            stamp = chalk.yellow(`${type} ${time}`);
            break;
        case "ERR":
            stamp = chalk.red(`${type} ${time}`);
        }

        console.log(`[${stamp}] ${msg}`);       
    }
    //log actual errors
    error(err) {
        console.log(`${chalk.red(err.code)}: ${err.message.toString()}\n${err.stack.split("\n").slice(1).join("\n")}`);
    }
}

module.exports = Logger;