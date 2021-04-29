let fs = require("fs");
let toml = require('toml');

module.exports.getConfig = function() {
    let data = toml.parse(fs.readFileSync(__dirname + "/../config.tml").toString());
    return {
        adlib: {
            schedule: data.adlib.schedule,
            baseUrl: data.adlib.baseUrl,
            username: data.adlib.username,
            password: data.adlib.password,
            limit: data.adlib.limit
        },
        database: {
            connectionURI: data.database.connectionURI
        },
        mapping: {
          baseURI: data.mapping.baseURI
        },
        eventstream: {
            protocol: data.eventstream.protocol,
            hostname: data.eventstream.hostname,
            port: data.eventstream.port,
            path: data.eventstream.path,
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