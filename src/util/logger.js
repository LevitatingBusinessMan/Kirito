const {green, yellow, red} = require("chalk");
const dayjs = require("dayjs");
const fs = require("fs");
const path = require("path");

class Logger {
    constructor(logDirectory, max_logs) {
        this.log_ = "";
        this.logFile = dayjs().format("(YY-M-D) HH[h]-mm[m]-ss[s]") + ".log";
        this.lastLogTime = new Date();

        if (logDirectory) {
            if (!fs.existsSync(logDirectory))
                fs.mkdirSync(logDirectory);

            let prevLogs = fs.readdirSync(logDirectory);
            if (prevLogs.length > max_logs-1 && max_logs)
                fs.unlink(path.join(logDirectory,prevLogs[0]), (e)=>{});

            let chars = /((\[)\d*m)|(\[[0-9][A-Z])|(\d)/g;
            let fileStream = fs.createWriteStream(path.join(logDirectory, this.logFile), {flag: "w"});
            let writeToStdOut = process.stdout.write.bind(process.stdout);
            process.stdout.write = process.stderr.write = d => {fileStream.write(d.toString().replace(chars,''));writeToStdOut(d);}
        }
    }

    checkDate() {
        if(this.lastLogTime.getDate() < new Date().getDate() ||
        this.lastLogTime.getMonth() < new Date().getMonth())
            console.log(`--[${dayjs().format("MMM D")}]--`)
        this.lastLogTime = new Date();
    }

    log(type, msg) {
        this.checkDate();
        console.log(this.parse(type,msg));       
    }

    parse(type, msg) {
        type = type.toUpperCase();

        let time = dayjs().format("HH:mm:ss");
        let stamp = `${type} ${time}`;
        switch (type) {
            case "INFO":
                stamp = green(`${type} ${time}`);
                break;
            case "WARN":
                stamp = yellow(`${type} ${time}`);
                break;
            case "ERR":
                stamp = red(`${type} ${time}`);
        }

        const fileAndLine = (new Error).stack.split("\n")[2].split("(")[1].split("/").last().split(":").splice(0,2).join(":")

        if (type == "ERR" || type == "WARN")
            return `[${stamp}] ${msg} (${fileAndLine})`;   
        else
            return `[${stamp}] ${msg}`;
            
    }

    //Shortcuts
    info(msg) {
        this.log("INFO",msg)
    }

    warn(msg) {
        this.log("WARN",msg)
    }

    err(msg) {
        this.log("ERR",msg)
    }

    /*
    For more serious errors.
    Different then the standard above this shows the full stack end ends up in the stderr stream
        And it logs to sentry
    */
    error(err) {
        this.checkDate();

        let message
        let trace

        //Error provided
        if (err instanceof Error) {
            if (!err.message)
                err.message = "No message"
            
            message = err.message
            trace = err.stack
        
        }
        
        //Only error message provided
        else {
            trace = (new Error()).stack
            if (typeof err == "object")
                err = JSON.stringify(err)
            message = err ? err : "No message"
        }

        //remove first line from trace
        trace = trace.split("\n").splice(1).join("\n")

        console.error(`[${red(`ERROR ${dayjs().format("HH:mm:ss")}`)}]: ${message}\n ${trace}`);
    }
}

module.exports = Logger;