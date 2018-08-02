class Server {
    constructor(port) {
        const express = require("express");
        app = express();
        app.use(express.static('public'));
    
        app.get('/', (req, res) => {res.send('hi')});
    
        app.listen(port);
        this.e = app;
    }
}

module.exports = Server;