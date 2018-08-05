module.exports = function ready (Kirito) {
    Kirito.loginSpinner.stop(Kirito.logger.parse("info","Logged in!"));

    //Drafts??
    const {red, green} = require('chalk');
    console.log(red("account: ") + green(Kirito.user.tag));
    console.log(red("guilds: ") + green(Kirito.guilds.size));
    console.log(red("users: ") + green(Kirito.users.size));
    console.log(red("prefix: ") + green(Kirito.config.prefix));

    //Check if guilds missing in DB
    Kirito.guilds.forEach(guild => {
        if (!Kirito.guilds_.has(guild.id))
            Kirito.guilds_.set(guild.id,Kirito.guildEntry(guild));
    });

}
