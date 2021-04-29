const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require("../../config/config.js").getConfig();
const sequelize = new Sequelize(config.database.connectionURI);

class Member extends Model {}
const attributes = {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    URI: {
        type: DataTypes.STRING,
        allowNull: false
    },
    institution: {
        type: DataTypes.STRING,
        allowNull: false
    },
    database: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payload: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '{}'
    },
};

module.exports.Member = Member;
module.exports.attributes = attributes;