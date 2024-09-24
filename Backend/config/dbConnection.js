require("dotenv").config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
    process.env.DB_NAME || "employee_cafe",
    process.env.DB_USER || "admin",
    process.env.DB_PASSWORD || "password",
    {
        host: process.env.DB_HOST || "mysql",
        dialect: "mysql",
        port: process.env.DB_PORT || 3306,
    }
);

module.exports = sequelize;
