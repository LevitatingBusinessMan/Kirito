const dayjs = require("dayjs")

class Uinfo {
    constructor() {
        this.help = {
            "description": "Get info about a user",
            "usage": "[prefix]uinfo asuna"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": true,
            "ownerOnly": false,
            "expectedArgs": false,
            "sameVC": false,
            "nsfw": false,
            "requires": []
        }
    }
	
	run(Kirito, args, message, alias, prefix, chn) {

		let dbUser
		let member
		if (!args.length) {
			member = message.member
			dbUser = Kirito.users_.get(message.author.id)
		}
		else {
			member = Kirito.getUser(args[0], message.guild.members)
			if (!member)
				return message.respond("User not found")

			//We can't be sure if this user is in the DB
			else if (Kirito.users_.has(member.id))
				dbUser = Kirito.users_.get(member.id)
		}

		let presence
		if (member.presence.game) {
			switch(member.presence.game.type) {
				case 0:
					presence = "Playing " + member.presence.game.name
					break;
				case 1:
					presence = "Streaming " + member.presence.game.name
					break;
				case 2:
					presence = "Listening " + member.presence.game.name
					break;
				case 3:
					presence = "Watching " + member.presence.game.name
					break;
			}
		}

		const embed =  new Kirito.Discord.RichEmbed()
		.setTitle(member.user.tag + (message.guild.owner.id == member.id ? ":crown:" : ""))
		.setDescription(member.user.id)
		.setColor(member.displayColor)
		.setThumbnail(member.user.displayAvatarURL)
		.setTimestamp(new Date())
		.addField(
			"Bio:",
			(dbUser ? (dbUser.bio ? dbUser.bio : "none") : "none"),
			(dbUser ? (dbUser.bio ? false : true) : true)
		)
		.addField(
			"Points:",
			(dbUser ? (dbUser.points ? dbUser.points : "0") : "0"),
			true
		)
		.addField(
			"Nickname:",
			(member.nickname ? member.nickname : "none"),
			true
		)
		.addField(
			"Bot:",
			member.user.bot,
			true
		)
		.addField(
			"Permissions:",
			member.permissions.bitfield,
			true
		)
		.addField(
			"Joined Discord:",
			dayjs(member.user.createdAt).format("D/M/YY"),
			true
		)
		.addField(
			"Joined guild:",
			dayjs(member.joinedAt).format("D/M/YY"),
			true
		)
		.addField(
			"Presence:",
			(presence ? presence + ", " : "") + member.presence.status,
			presence ? false : true
		)
		.setFooter(
			message.author.username + " | " + message.guild.name,
			message.author.avatarURL
		)

		message.respond(embed)

	}

}

module.exports = Uinfo;