/**
 * Uses a message and its args to search for a song with user input
 * @param {message Object} message Discord.js message
 * @param {array} args Args from message
 */
module.exports = async function(message, args) {
    return new Promise(async (resolve, reject) => {
        const Kirito = this;
        //should fix error handling with this
        //Also, look at using this in other utils
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
            let {data} = await Kirito.lavaRest(args[0]);
            
            if (data.loadType == "LOAD_FAILED")
                reject({data, message});
            
            if (data.loadType == "NO_MATCHES")
                search();

            if (data.loadType == "TRACK_LOADED") {
                message.respond(`Playing: \`${data.tracks[0].info.title}\``);
                resolve(data.tracks[0]);
            }
            
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
                            msg.delete();
                            collector.stop();
                        }
                        let choice = parseInt(msg.content)
                        if (choice <= 2 && choice > 0) {
                            msg.delete();
                            if (choice == 1) {
                                (await list).edit(`Song selected: \`${data.tracks[data.playlistInfo.selectedTrack].info.title}\``);
                                resolved = true;
                                resolve(data.tracks[choice]);
                            }
                            if (choice == 2) {
                                (await list).edit(`Queued playlist: \`${data.playlistInfo.name}\``);
                                resolved = true;
                                resolve(data.tracks);
                            }
                        }
                    });
                    collector.on('end', async () => {if (!resolved) (await list).edit(`Cancelled song/playlist selection`)});
                }
                else {
                    message.respond(`Queuing playlist: \`${data.playlistInfo.name}\``);
                    resolve(data.tracks);
                }
            }
        }

        async function search() {
            let {data} = await Kirito.lavaRest(sc?"scsearch:":"ytsearch:" + args.join(" "));
            
            if (data.loadType == "LOAD_FAILED")
                reject({data, message});
            
            if (data.loadType == "NO_MATCHES")
                return message.respond('No results :[');
            else {
                let msg = "Choose:\n";
                for (let i = 0; i < data.tracks.length && i < 10; i++) {
                    const {info} = data.tracks[i];
                    let title = info.title.length > 70 ? info.title.substring(0,67)+"...":info.title;
                    msg += `\`${i+1}\` ${title}\n`;
                }
                msg += "**Cancel with** `c`";
                let list = message.respond(msg);
                let resolved; //True if choice has been made

                //For some reason a collector is not an actual eventEmitter?
                let collector = message.channel.createMessageCollector(msg => msg.author.id == message.author.id,{time: 15000});
                collector.on('collect', async (msg) => {
                    if (msg.content == 'c') {
                        msg.delete();
                        collector.stop();
                    }
                    let choice = parseInt(msg.content);
                    if (choice <= 10 && choice > 0) {
                        (await list).edit(`Song selected: \`${data.tracks[choice].info.title}\``);
                        msg.delete();
                        resolved = true;
                        resolve(data.tracks[choice]);
                    }
                });
                collector.on('end', async () => {if (!resolved) (await list).edit(`Cancelled song selection for query: \`${args.join(' ')}\``)});
            }
        }
    });
}