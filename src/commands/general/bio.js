class Bio {
    constructor() {
        this.help = {
            "description": "Set a description of yourself. To see the bio of others, use the uinfo command.",
            "usage": "[prefix]bio lover of peanut butter"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": false,
            "sameVC": false,
            "nsfw": false,
            "requires": []
        }
    }
	
	run(Kirito, args, message, alias, prefix, chn) {

		const user = Kirito.users_.get(message.author.id)
		if (!user) {
			Kirito.logger.warn("Wasn't able to find user in DB with bio command")
			return message.respond(":x: Something went wrong")
		}

		//Request current bio
		if (!args.length) {
			if (!user.bio)
				message.respond("You currently have no bio")
			else
				message.respond(`Currently your bio is:\n\`\`\`${user.bio}\`\`\`\nWould you like to delete it?`)
				.then(
					msg => msg.confirm()
					.accept(() => {
						user.bio = false
						Kirito.users_.set(user.id, user);
						msg.edit("Deleted your bio")
					})
					.deny(() => {
						msg.edit(`Your bio is:\n\`\`\`${user.bio}\`\`\``)
					})
				)
		} else {

			const text = args.join(" ")

			if (text.length > 150)
				return message.respond("Your bio can't be over 100 characters")

			user.bio = text
			Kirito.users_.set(user.id, user)
			message.respond(`Changed your bio to \`${text}\``)
	
		}

	}

}

module.exports = Bio;