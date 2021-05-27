import { DataTypes, Model } from 'sequelize';

export class Member extends Model {}
export const attributes = {
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
    version: {
        type: DataTypes.STRING,
        allowNull: true
    },
    institution: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adlibDatabase: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payload: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '{}'
    },
};

export const indexes = [
    {
        fields: ['version']
    },
    {
        fields: ['institution']
    },
    {
        fields: ['adlibDatabase']
    },
    {
        fields: ['generatedAtTime']
    },
];