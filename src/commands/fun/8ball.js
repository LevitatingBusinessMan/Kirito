class Eightball {
    constructor() {
        this.help = {
            "description": "Ask the magic 8 ball a question",
            "usage": "[prefix]8ball Should I ban all other bots except Kirito?"
        }
        this.conf = {
            "disabled": false,
            "aliases": ["ask"],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": "str",
            "sameVC": false,
            "nsfw": false,
            "requires": []
        }
    }
	
	run(Kirito, args, message, alias, prefix, chn) {
		const answers = [
			"as I see it, yes",
			"ask again later",
			"don’t count on it",
			"it is certain",
			"it is decidedly so",
			"most likely",
			"my reply is no",
			"my sources say no",
			"signs point to yes",
			"very doubtful",
			"yes",
			"yes, definitely",
			"i would like to say yes, but I say no",
			"possibly",
			"obiously not",
			"only you can tell"
		]

		message.respond(`:8ball:: ${answers.random()}`)

    }
}

module.exports = Eightball;