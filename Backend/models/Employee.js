const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConnection");

const Employee = sequelize.define(
    "Employee",
    {
        id: {
            type: DataTypes.STRING(9),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email_address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[89][0-9]{7}$/, 
            },
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["Male", "Female", "Others"]],
            },
        },
    },
    {
        tableName: "employees",
        timestamps: false,
    }
);

module.exports = Employee;
