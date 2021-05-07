let fs = require("fs");
let toml = require('toml');

module.exports.getConfig = function() {
    let data = toml.parse(fs.readFileSync(__dirname + "/../config.tml").toString());
    return {
        adlib: {
            schedule: data.adlib.schedule,
            baseUrl: data.adlib.baseUrl,
            username: data.adlib.username,
            password: process.env.ADLIB_SECRET ? process.env.ADLIB_SECRET : data.adlib.password,
            limit: data.adlib.limit
        },
        database: {
            connectionURI: process.env.DATABASE_URI ? process.env.DATABASE_URI : data.database.connectionURI
        },
        mapping: {
          baseURI: data.mapping.baseURI
        },
        eventstream: {
            protocol: process.env.EVENTSTREAM_PROTOCOL ? process.env.EVENTSTREAM_PROTOCOL : data.eventstream.protocol,
            hostname: process.env.EVENTSTREAM_HOSTNAME ? process.env.EVENTSTREAM_HOSTNAME : data.eventstream.hostname,
            port: process.env.EVENTSTREAM_PORT ? process.env.EVENTSTREAM_PORT : data.eventstream.port,
            path: process.env.EVENTSTREAM_PATH ? process.env.EVENTSTREAM_PATH : data.eventstream.path,
            numberOfObjectsPerFragment: data.eventstream.numberOfObjectsPerFragment
        },
        hva: {
            institutionName: data.hva.institutionName,
            institutionURI: data.hva.institutionURI
        },
        dmg: {
            institutionName: data.dmg.institutionName,
            institutionURI: data.dmg.institutionURI
        },
        industriemuseum: {
            institutionName: data.industriemuseum.institutionName,
            institutionURI: data.industriemuseum.institutionURI
        },
        archiefgent: {
            institutionName: data.archiefgent.institutionName,
            institutionURI: data.archiefgent.institutionURI
        },
        stam: {
            institutionName: data.stam.institutionName,
            institutionURI: data.stam.institutionURI
        }
    };
};

module.exports.getInstitutionFromURI = function(institutionURI) {
    let config = this.getConfig();
    for(let i in Object.keys(config)) {
        let key = Object.keys(config)[i];
        if (config[key].institutionURI && config[key].institutionURI === institutionURI) return key;
    }
    return "";
}