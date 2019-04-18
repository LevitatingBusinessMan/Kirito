# config
[Example config](https://github.com/LevitatingBusinessMan/Kirito/blob/master/config/config.js.example)

#### prefix
The prefix for each command. Default: `k!`

#### admins
Array with IDs of the admin(s) as strings.
Admins have access to commands like eval, and thus have comeplete access to Kirito. Use this setting with care.

#### token (required)
The bots token. The bot uses this to log into it's own Discord bot account.
You can get one by creating a bot [here](https://discordapp.com/developers/applications/).
People with this token have comepletely access to the bots Discord account and all of it's permmissions.
Kirito demands administrator permission by default so DO NOT leak this.

#### client-secret
Can be left as default for now, it's only used in the dropped REST api feature.
Default: `""`

#### log
If this is set to true, Kirito will log any console output to a file.
A new log file will be created at each startup.
Default: `true`

#### max_logs
Max amount of log files to be present at a time. Prevents filling up your hard drive comepletely when you have Kirito running as a pm2 daemon or whatever but it's going into a start-fail loop.
When set to `false` Kirito won't delete any log files.
Deafault: `10`

#### private
(Currently not doing shit)
If this is enabled Kirito won't show it's invite link anywhere. Make sure that if you don't want anyone adding Kirito to your server you should always disable the "public bot" setting at your bots application settings at the  [Developer Portal](https://discordapp.com/developers/applications/)
Default: `true`

#### show_disabled
There is a big chance when you are running Kirito that some commands will be disabled.
Some commands require keys for external API's, and all voice commands require having a [LavaLink](https://github.com/Frederikam/Lavalink) server running.
When `show_disabled` is enabled these commands will still show up in Kirito's help command.
Default: `false`

#### logChannel
The ID (string) for Kirito's logging channel. At this point in time Kirito will only log the joining and leaving of guilds but in the future more things like errors could be logged here.
Default: `""`

#### raven
[Sentry](https://sentry.io) DNS url for error tracking. This is mostly just useful for developers to keep track of bugs.
Default: `""`

#### lavaLinkNode
Kirito uses [LavaLink](https://github.com/Frederikam/Lavalink) for handling playing music. When you want to use Kirito's music features you have to set a Lavalink server up and add it here. The value is a node configuration for [discord.js-lavalink](https://github.com/MrJacz/discord.js-lavalink/#implementation). Currently only using one node is supported.
Example node: `{"host": "localhost", "port": 2333, "region": "eu", "password": "youshallnotpass"}`
Default: `false`

#### lavaRestTimeout
Sets the request timeout for the LavaPlayers REST api in ms (used of gathering song data). If a request takes longer than this it'll be dismissed and Kirito will respond with a failure message.
A default of 10.000ms seems like much but lavaRest has an issue where a Youtube Mix request can take up to 20 seconds. I made an issue about it [here](https://github.com/sedmelluq/lavaplayer/issues/130).
Default: `10000`

#### express
Kirito's REST api. At some point in time a [web Dashboard](https://github.com/LevitatingBusinessMan/Kirito_server) for Kirito was in deverlopment and it communicated through this api. It is recommend to disable this.
Default: `false`

#### db
What [Enmap 3 provider](https://enmap.evie.codes/v/3/usage/persistent-enmaps) should be used as a database. For a quick standalone set-up it is recommended to use `level`. This will use level-db as a database backend and store data locally. The second option is `rethink`, which requires an external [RethinkDB](https://www.rethinkdb.com/) server. RethinkDB has a lot of benefits over leveldb which enmap/kirito doesn't make use of and a web dashboard.
Default: `level`

#### Rethink
Object with RethinkDB settings, should only be configured when `db` is set to `rethink`.
* **dbName**: Name of the database to be used (Kirito)
* **host**: Ip of RethinkDB server (localhost)
* **port**: Port of the RethinkDB server (28015)

# keys
Kirito requires some API keys to access certain external API's. These are all optional.
##### googleGeoAPIkey
Key for Google's GeoDecoding api
##### DarkSkyAPIKey
Key for the Dark Sky weather API