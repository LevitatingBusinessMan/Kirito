module.exports = function ready (Kirito, arg) {
    Kirito.loginSpinner.stop();
    const {red, green} = require('chalk');

    console.log(red("account: ") + green(Kirito.user.tag));
    console.log(red("guilds: ") + green(Kirito.guilds.array().length));
    console.log(red("users: ") + green(Kirito.users.array().length));
    console.log(red("prefix: ") + green(Kirito.config.prefix));
}
