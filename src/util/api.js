module.exports = new Promise((resolve,reject) => {
    const express = require('express');
    const app = express();

    app.listen(80, resolve(app))
})
