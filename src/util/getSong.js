/**
 * Uses a message and its args to search for a song with user input
 * @param {message Object} message Discord.js message
 * @param {array} args Args from message
 */
module.exports = async function(message, args) {
    return new Promise(async (resolve, reject) => {
        const deletePerms = message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES");
        const Kirito = this;

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
            //First try direct search
            Kirito.lavaRest(args[0]).catch(reject)
            .then(({data}) => {
                if (data.loadType == "LOAD_FAILED")
                    return resolve(null);
                
                if (data.loadType == "NO_MATCHES")
                    search();

                if (data.loadType == "TRACK_LOADED")
                    resolve(data.tracks[0]);
                
                if (data.loadType == "PLAYLIST_LOADED") {
                    //Playlist with specific song selected
                    if (data.playlistInfo.selectedTrack > -1) {
                        let msg = `Found playlist \`${data.playlistInfo.name}\` with selected song \`${data.tracks[data.playlistInfo.selectedTrack].info.title}\`\n`;
                        msg += `\`1\` Play \`${data.tracks[data.playlistInfo.selectedTrack].info.title}\`\n`;
                        msg += "`2` Queue whole playlist\n";
                        msg += "**Cancel with** `c`";
                        let list = message.respond(msg);
                        let resolved; //True if choice has been made
                        let collector = message.channel.createMessageCollector(msg => msg.author.id == message.author.id,{time: 10000});
                        collector.on('collect', async (msg) => {
                            if (msg.content == 'c') {
                                if (deletePerms)
                                    msg.delete();
                                collector.stop();
                            }
                            let choice = parseInt(msg.content)
                            if (choice <= 2 && choice > 0) {
                                if (deletePerms)
                                    msg.delete();
                                if (choice == 1) {
                                    (await list).edit(`Song selected: \`${data.tracks[data.playlistInfo.selectedTrack].info.title}\``);
                                    resolved = true;
                                    resolve(data.tracks[data.playlistInfo.selectedTrack]);
                                }
                                if (choice == 2) {
                                    (await list).edit(`Queued ${data.tracks.length} songs from: \`${data.playlistInfo.name}\``);
                                    resolved = true;
                                    //Make queue start at selected song
                                    let index = data.tracks.indexOf(data.tracks[data.playlistInfo.selectedTrack])
                                    let tracks = data.tracks.splice(index);
                                    resolve(tracks.concat(data.tracks));
                                }
                            }
                        });
                        collector.on('end', async () => {if (!resolved) (await list).edit(`Cancelled song/playlist selection`)});
                    }
                    else {
                        message.respond(`Queued ${data.tracks.length} songs from: \`${data.playlistInfo.name}\``);
                        resolve(data.tracks);
                    }
                }
            });
        }

        async function search() {
            Kirito.lavaRest(sc?"scsearch:":"ytsearch:" + args.join(" ")).catch(reject)
            .then(({data}) => {
                if (data.loadType == "LOAD_FAILED")
                    return resolve(null);
                
                if (data.loadType == "NO_MATCHES")
                    return message.respond('No results :[');
                else {
                    let msg = "Choose:\n";
                    for (let i = 0; i < data.tracks.length && i < 10; i++) {
                        const {info} = data.tracks[i];
                        let title = info.title.length > 70 ? info.title.substring(0,67)+"...":info.title;
                        
                        //Stupid markdown
/*                         if (title.split(/\*\/).length % 2)
                            title = title.replace(/\*\/,"");
                        if (title.split(/_/).length % 2)
                            title = title.replace(/_/,"");
                        if (title.split(/-/).length % 2)
                            title = title.replace(/-/,""); */
                        
                        msg += `\`${i+1}\` ${title}\n`;
                    }
                    msg += "**Cancel with** `c`";
                    let list = message.respond(msg);
                    let resolved; //True if choice has been made

                    //For some reason a collector is not an actual eventEmitter?
                    let collector = message.channel.createMessageCollector(msg => msg.author.id == message.author.id,{time: 15000});
                    collector.on('collect', async (msg) => {
                        if (msg.content == 'c') {
                            if (deletePerms)
                                msg.delete();
                            collector.stop();
                        }
                        let choice = parseInt(msg.content);
                        if (choice <= 10 && choice > 0) {
                            (await list).edit(`Song selected: \`${data.tracks[choice-1].info.title}\``);
                            if (deletePerms)
                                msg.delete();
                            resolved = true;
                            resolve(data.tracks[choice-1]);
                        }
                    });
                    collector.on('end', async () => {if (!resolved) (await list).edit(`Cancelled song selection for query: \`${args.join(' ')}\``)});
                }
            });
        }
    });
}