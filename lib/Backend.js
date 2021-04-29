const { Writable } = require('stream');
const Utils = require('./utils.js');
let Config = require("../config/config.js");

class Backend extends Writable {
    constructor(options) {
        super();
        let config = Config.getConfig();

        this._adlibDatabase = options.adlibDatabase;
        this._institution = options.institution;
        this._db = options.db;

    }
}

Backend.prototype._write = function (chunk, encoding, done) {
    // write object  to file
    let object = JSON.parse(chunk);
    Utils.insertObject(this._institution, this._db, object, this._adlibDatabase);
    done();
};

module.exports = Backend;