const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnection");

const Cafe = sequelize.define(
    "Cafe",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "cafes",
        timestamps: false,
    }
);

module.exports = Cafe;
