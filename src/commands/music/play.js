class Play {
    constructor() {
        this.help = {
            "description": "I'll do this documentation later",
            "usage": "[prefix] play We Are Number One"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": "*",
            "nsfw": false,
            "requires": []
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        if (!message.member.voiceChannel)
            return message.respond(":x: You are not in a voice channel!");

        let sc = false;
        if (args.includes("-sc")) {
            if (!args[1])
                return message.respond(":x: No search query defined!")
            
            sc = true;
            args.remove("-sc");
            search();
        }

        else if (args.length > 1)
            search();
    
        else {
            let {data} = await Kirito.getSong(args[0]);
            if (data.loadType == "LOAD_FAILED")
                throw {data, message};
            
            if (data.loadType == "NO_MATCHES")
                search();
        }

        function search() {
            let {data} = await Kirito.getSong(sc?"scsearch:":"ytsearch:" + args.join(" "));
        }
    }
}

module.exports = Play;