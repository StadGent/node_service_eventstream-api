import fs from 'fs';
import toml from 'toml';
export default class Config {
  static getConfig() {
    let data = toml.parse(fs.readFileSync(__dirname + "/../config.tml").toString());
    return {
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
  }
  static getInstitutionFromURI(institutionURI) {
    let config = this.getConfig();
    for(let i in Object.keys(config)) {
      let key = Object.keys(config)[i];
      if (config[key].institutionURI && config[key].institutionURI === institutionURI) return key;
    }
    return "";
  }
}
