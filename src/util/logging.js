const {green, yellow, red} = require("chalk");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");
const readline = require('readline');

class Logger {
    constructor(logDirectory) {
        this.log_ = "";
        this.logFile = dayjs().format("(D-M-D) HH[h]-mm[m]-ss[s]") + ".txt";

        if (logDirectory) {
            if (!fs.existsSync(logDirectory))
                fs.mkdirSync(logDirectory);
            this.writeStream = fs.createWriteStream(path.join(logDirectory, this.logFile), {flag: "a"})
            //process.stdout.pipe(this.writeStream);
            //process.stderr.pipe(this.writeStream);
        }
    }
    //Logging messages to console

/*     This should probably be rewritten to look more like Augusts
    where different kinds of logging methods are used */

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