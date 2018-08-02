module.exports = function ready (Kirito, arg) {
    Kirito.loginSpinner.stop(Kirito.logger.parse("ok","Logged in!"));
    const {red, green} = require('chalk');

    //Drafts??
    console.log(red("account: ") + green(Kirito.user.tag));
    console.log(red("guilds: ") + green(Kirito.guilds.array().length));
    console.log(red("users: ") + green(Kirito.users.array().length));
    console.log(red("prefix: ") + green(Kirito.config.prefix));
}
