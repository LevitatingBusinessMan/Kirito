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

    //Set LavaLink Manager
    const { PlayerManager } = require("discord.js-lavalink");
    const nodes = [{ "host": "localhost", "port": 80, "region": "eu", "password": "youshallnotpass" }];
    Kirito.player = new PlayerManager(Kirito, nodes, {
        user: Kirito.user.id,
        shards: 1
    });

    if (Kirito.config.raven)
        Kirito.Raven = require("raven").config(Kirito.config.raven).install();
}
