const sequelize = require('../config/dbConnection');
const Cafe = require('./Cafe');
const Employee = require('./Employee');
const EmployeeCafe = require('./EmployeeCafe');

// Define associations
Cafe.hasMany(EmployeeCafe, { foreignKey: 'cafe_id', as: 'EmployeeCafes' });
EmployeeCafe.belongsTo(Cafe, { foreignKey: 'cafe_id' });
Employee.hasMany(EmployeeCafe, { foreignKey: 'employee_id', as: 'EmployeeCafes' });
EmployeeCafe.belongsTo(Employee, { foreignKey: 'employee_id' });

// Sync models
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false }); 
        console.log('Database synced successfully.');
        
    } catch (err) {
        console.error('Error syncing database:', err);
    }
};

module.exports = { Cafe, Employee, EmployeeCafe, syncDatabase };
