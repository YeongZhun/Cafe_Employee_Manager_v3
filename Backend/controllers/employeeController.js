const employeeService = require('../services/employeeService');
const { Cafe, Employee, EmployeeCafe } = require('../models/index');

const getEmployee = async (req, res) => {
  try {
      const { id } = req.params; // Get the ID from the request parameters
      const employee = await employeeService.getEmployeeById(id);

      // If the employee is not found, return a 404 error
      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json(employee);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};


const getAllEmployees = async (req, res) => {
  try {
    const cafe = req.query.cafe;

    // If cafe is empty, get all employees 
    if (!cafe) {
      const employees = await employeeService.getEmployees();
      return res.status(200).json(employees);
    }

    // Find the cafe record based on the cafe name
    const cafeData = await Cafe.findOne({ where: { name: cafe } });

    if (!cafeData) {
      return res.status(404).json({ message: 'Cafe not found' });
    } else {
      const cafeId = cafeData.id;

      // Check if cafe has any employees associated
      const employeeCount = await EmployeeCafe.count({
        where: { cafe_id: cafeId },
      });

      if (!employeeCount) {
        return res.status(200).json({ message: 'Cafe exists but has no employees' });
      } else {
        // At this point, cafe exists and has employees, so return that list of employees
        const employees = await employeeService.getEmployees(cafeId);
        res.status(200).json(employees);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const createEmployee = async (req, res) => {
  try {
    const { id, name, email_address, phone_number, gender, cafe, start_date } = req.body;
    
    const newEmployee = await employeeService.createNewEmployee({ id, name, email_address, phone_number, gender, cafe, start_date });

    res.status(201).json({
      message: 'Employee created successfully',
      employee: newEmployee,
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};


const updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email_address, phone_number, gender, cafe, start_date } = req.body;

    const updatedEmployee = await employeeService.updateCurrentEmployee({ id, name, email_address, phone_number, gender, cafe, start_date });

    res.status(200).json({
      message: 'Employee updated successfully',
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};


const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id; 

    const result = await employeeService.deleteEmployeeById(employeeId);

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = { getEmployee, getAllEmployees, createEmployee, updateEmployee, deleteEmployee };