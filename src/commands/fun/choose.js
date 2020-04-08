class Choose {
    constructor() {
        this.help = {
            "description": "Make the bot choose between multiple options. Seperate your options with a semi-colon (;).",
            "usage": "[prefix]choose Lizbeth ; Asuna"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": /.*;.*/,
            "sameVC": false,
            "nsfw": false,
            "requires": []
        }
    }
	
	run(Kirito, args, message, alias, prefix, chn) {

		const options = args.join(" ").split(";")
		if (options.length < 2)
			return message.respond("I need more than 1 option to choose from...")
		
		message.respond(`I choose: \`${options.random().trim()}\``)

	}

}

module.exports = Choose;