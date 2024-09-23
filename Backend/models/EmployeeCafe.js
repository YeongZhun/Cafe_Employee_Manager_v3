const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const Employee = require('./Employee');
const Cafe = require('./Cafe');

const EmployeeCafe = sequelize.define('EmployeeCafe', {
  employee_id: {
    type: DataTypes.STRING(9),
    references: {
      model: Employee,
      key: 'id',
    },
    primaryKey: true,
  },
  cafe_id: {
    type: DataTypes.UUID,
    references: {
      model: Cafe,
      key: 'id',
    },
    primaryKey: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'employee_cafe',
  timestamps: false,
});

module.exports = EmployeeCafe;

