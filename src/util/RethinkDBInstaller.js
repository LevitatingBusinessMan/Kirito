const url = "http://download.rethinkdb.com/windows/rethinkdb-2.3.6.zip";

//Assuming we are on windows
module.exports = new Promise((resolve, reject) => {
    const path = require("path");
    const fs = require("fs");
    const {log} = new  (require(path.join(__dirname, 'logger.js')))();

    let location_zip = path.join(__dirname, '../', url.split('/').last());
    let location_folder = location_zip.split(".zip")[0];
    let location_exe = path.join(location_folder, "../", "rethinkdb.exe");

    if (fs.existsSync(location_exe))
        return resolve(log("ok", "RethinkDB found"));
    
    log('ok', "RethinkDB not found, installng now");

    const http = require("http");
    const unzip = require("unzip");

    try {

        let stream = fs.createWriteStream(location_zip);
        http.get(url, response => response.pipe(stream));

        log('ok', 'downloading RethinkDB');

        stream.on('finish', () => {

            log('ok', 'unzipping RethinkDB');
            let extract = unzip.Extract({path: path.join(__dirname, '../')});
            fs.createReadStream(location_zip).pipe(extract)
            extract.on('close', () => {
                log('ok', 'moving RethinkDB');
                fs.renameSync(path.join(location_folder, "rethinkdb.exe"), location_exe);
                log('ok', 'cleaning up files\n');
                fs.rmdirSync(location_folder);
                fs.unlinkSync(location_zip);
                resolve();
            });

        });

    } catch (e) {
        log('err', `Installing RethinkDB failed, error: ${e}`)
    }
});