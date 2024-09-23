const express = require("express");
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/employee/:id', employeeController.getEmployee);

// GET /employees?cafe=<café>
router.get('/employees', employeeController.getAllEmployees);

// POST /employee
router.post('/employee', employeeController.createEmployee);

// PUT /employee/:id
router.put('/employee/:id', employeeController.updateEmployee);

// DELETE /employee/:id
router.delete('/employee/:id', employeeController.deleteEmployee);

module.exports = router;
