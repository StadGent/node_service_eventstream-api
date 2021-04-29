let config = require("../config/config.js").getConfig();
let port = config.eventstream.port != '' ? ':' + config.eventstream.port : '';
let path = config.eventstream.path != '' ? config.eventstream.path + '/' : '';

const { Sequelize } = require('sequelize');

module.exports = new class Utils {
    async insertObject(institution, db, object, adlibDatabase) {
        let generatedAtTime = new Date(object["prov:generatedAtTime"]).toISOString();
        let URI = object["@id"];

        await db.models.Member.create({
            URI: URI,
            institution: institution,
            database: adlibDatabase,
            generatedAtTime: generatedAtTime,
            payload: JSON.stringify(object)
        });
    }

    sendNotFound(req, res) {
        res.set({
            'Content-Type': 'text/html'
        });
        let homepage = config.eventstream.protocol + '://' + config.eventstream.hostname + port + '/' + path;
        res.status(404).send('Not data found. Discover more here: <a href="' + homepage + '">' + homepage + '</a>');
    }

    async initDb() {
        const sequelize = new Sequelize(config.database.connectionURI);
        const Member = require('./models/Member').Member;
        const memberAttributes = require('./models/Member').attributes;
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

    getURIFromRecord(record, priref, type, database) {
        if (record) {
            for (let s in record.source) {
                const source = record.source[s].endsWith('/') ? record.source[s] : `${record.source[s]}/`
                if (source.startsWith('http') && record['term.number']) {
                    const termNumber = record['term.number'][s].toLowerCase().replace(' ', '');
                    return `${source}${termNumber}`;
                }
            }
        }
        // create identifier for concept that will be published with an event stream
        const baseURI = config.mapping.baseURI.endsWith('/') ? config.mapping.baseURI : config.mapping.baseURI + '/';
        // URI template: https://stad.gent/id/{type}/{scheme-id}/{concept-ref}
        return `${baseURI}${type}/${priref}`;
    }
}