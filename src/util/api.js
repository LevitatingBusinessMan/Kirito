//Dashboard API
module.exports = (Kirito) => new Promise((resolve,reject) => {
    const express = require('express');
    const basicAuth = require('basic-auth-connect');
    const app = express();
    app.use(basicAuth("Kirito", Kirito.config.client_secret));

    //Get all server where user is server manager
    app.get('/api/get_servers', (req,res) => {
        if (!req.query.id) return res.status(400).send({
            status: "ERROR",
            error: "NoUserIDProvided",
        });
        const id = req.query.id;
        const guilds = Kirito.guilds.filter(g => {
            if (g.members.has(id)) {
                const member = g.members.get(id);
                return member.permissions.has("MANAGE_GUILD")
            }
        }).map(g => Object.assign(Kirito.guilds_.get(g.id), {icon:g.icon}));
        res.send(guilds)
    })

    app.get('/api/save', (req,res) => {
        const {id,name,value} = req.query;
        if (!id || !name || !value) return res.status(400).send({
            status: "ERROR",
            error: "MissingParams",
        });

        const guild = Kirito.guilds_.get(id)
        if (!guild) return res.status(400).send({
            status: "ERROR",
            error: "BadGuildID",
        });

        switch(name) {
            case "prefix":
                guild.prefix = JSON.parse(value);
                Kirito.guilds_.set(guild.id,guild)
                res.send({status:"OK", message:"Setting saved"})
                break;
            default:
                res.status(400).send({status:"ERROR", message:"Unaccepted setting name"})
        }
    })

    app.listen(3000, resolve(app))
})
