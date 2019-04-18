class Weather {
    constructor() {
        this.help = {
            "description": "Get current weather in certain location",
            "usage": "[prefix]weather Amsterdam"
        }
        this.conf = {
            "disabled": false,
            "aliases": [],
            "perms": [],
            "guildOnly": false,
            "ownerOnly": false,
            "expectedArgs": "str",
            "sameVC": false,
            "nsfw": false,
            "requires": ["googleGeoAPIkey", "DarkSkyAPIKey"]
        }
    }
    async run(Kirito, args, message, alias, prefix, chn) {
        
        const GoogleKey = Kirito.config.keys.googleGeoAPIkey;
        const DarkSkyKey = Kirito.config.keys.DarkSkyAPIKey;

        const request = require("axios");

        request.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${args.join("+").toString()}&key=${GoogleKey}`).then(G_result => {

            if (G_result.data.error_message) {
                Kirito.log("err","Geocode: " + G_result.data.error_message);
                message.respond(":x: Something went wrong :v");
            }

            if (G_result.data.status == "ZERO_RESULTS") return message.respond("Address not found :v");
    
    
            var Geo = new Object;
            Geo.address = G_result.data.results[0].formatted_address;
            Geo.lat = G_result.data.results[0].geometry.location.lat;
            Geo.lng = G_result.data.results[0].geometry.location.lng;
    
            request.get(`https://api.darksky.net/forecast/${DarkSkyKey}/${Geo.lat},${Geo.lng}?exclude=minutely,hourly,daily,alerts,flags`).then( ({data:{currently}}) => {

                message.respond({embed: {
                    hexColor: '#ffff00',
                    title: getIcon() + ' Weather report',
                    description: currently.summary,
                    fields:  [{
                        name: "Location",
                        value: Geo.address.replace(/, /g , "\n"),
                        inline: true
                    },{
                        name: "Summary",
                        value: currently.summary,
                        inline: true
                    },{
                        name: "Temperature",
                        value: (currently.temperature).toFixed(1) + '°F\n' +  ((currently.temperature-32)*(5/9)).toFixed(1)  + '°C',
                        inline: true
                    },{
                        name: "Precipitation",
                        value: Math.round(currently.precipProbability) * 100 + '%, ' + (currently.precipType ? currently.precipType : "undefined"),
                        inline: true
                    },{
                        name: "Humidity",
                        value: Math.round(currently.humidity * 100) + '%',
                        inline: true
                    },{
                        name: "Wind speed",
                        value: currently.windSpeed.toFixed(1)   + 'm/h\n' + (currently.windSpeed * 1.609344).toFixed(1)  + 'km/h',
                        inline: true
                    }],
                    timestamp: new Date(currently.time * 1000)}
                });

                function getIcon() {
                    switch (currently.icon) {
                        case 'clear-day': return ':sunny:'
                        case 'clear-night': return ':city_sunset:';
                        case 'rain': return ':cloud_rain:';
                        case 'snow': return ':cloud_snow:';
                        case 'sleet': return ':cloud_snow:';
                        case 'wind': return ':dash:';
                        case 'fog': return ':foggy:';
                        case 'cloudy': return ':cloud:';
                        case 'partly-cloudy-day': return ':white_sun_small_cloud:';
                        case 'partly-cloudy-night': return ':night_with_stars:';
                        default: return ':grey_question:';
                    }
                }

            })
            .catch(e => {
                Kirito.logger.error(e);
                message.respond(":x: Something went wrong :v");
            })
    
        })
        .catch(e => {
            Kirito.logger.error(e);
            message.respond(":x: Something went wrong :v");
        })

    }
}

module.exports = Weather;