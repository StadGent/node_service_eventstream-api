import Config from '../config/config';
import { Sequelize } from 'sequelize';
import { Member, attributes as memberAttributes } from './models/Member';

const config = Config.getConfig();
const port = config.eventstream.port != '' ? ':' + config.eventstream.port : '';
const path = config.eventstream.path != '' ? config.eventstream.path + '/' : '';

export default class Utils {
  static async insertObject(institution, db, object, adlibDatabase) {
    let generatedAtTime = new Date(object["prov:generatedAtTime"]).toISOString();
    let URI = object["@id"];

    await db.models.Member.create({
      URI: URI,
      institution: institution,
      adlibDatabase: adlibDatabase,
      generatedAtTime: generatedAtTime,
      payload: JSON.stringify(object)
    });
  }

  static sendNotFound(req, res) {
    res.set({
      'Content-Type': 'text/html'
    });
    let homepage = config.eventstream.protocol + '://' + config.eventstream.hostname + port + '/' + path;
    res.status(404).send('Not data found. Discover more here: <a href="' + homepage + '">' + homepage + '</a>');
  }

  static async initDb() {
    const sequelize = new Sequelize(config.database.connectionURI);
    const memberOptions = {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'Member', // We need to choose the model name,
      createdAt: 'generatedAtTime' // I want createdAt to be called generatedAtTime
    };
    await Member.init(memberAttributes, memberOptions);
    //await sequelize.sync({force: true});
    await sequelize.sync();

    return sequelize;
  }

  static getURIFromRecord(record, priref, type, database) {
    if (record) {
      for (let s in record.source) {
        const source = record.source[s].endsWith('/') ? record.source[s] : `${record.source[s]}/`;
        if (source.startsWith('http') && record['term.number']) {
          const termNumber = record['term.number'][s].toLowerCase().trim().replace(' ', '');
          return `${source}${termNumber}`;
        }
      }
    }
    // create identifier for concept that will be published with an event stream
    const baseURI = config.mapping.baseURI.endsWith('/') ? config.mapping.baseURI : config.mapping.baseURI + '/';
    // URI template: https://stad.gent/id/{type}/{scheme-id}/{concept-ref}
    return `${baseURI}${type}/${priref}`;
  }

  static log(message, loggerName, level, correlationId) {
    let levelValue = 0;
    if (level === "INFO") levelValue = 4;
    else if (level === "ERROR") levelValue = 2;
    else if (level === "CRIT") levelValue = 1;

    console.log(`{"@timestamp":"${new Date().toISOString()}","@version":1,"message":"${message}","logger_name":"${loggerName}","level":${level}","level_value":${levelValue},"correlationId":"${correlationId}"}`);
  }
}
