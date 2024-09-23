import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Paper, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { fetchEmployee, createEmployee, updateEmployee } from '../api/api';

const AddEditEmployeePage = () => {
  const { empId } = useParams(); // Get employee ID from URL
  const navigate = useNavigate();
  console.log(empId);

  const [employee, setEmployee] = useState({
    id: '', 
    name: '',
    email_address: '',
    phone_number: '',
    cafe: '',
    gender: '',
    start_date: '', 
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  //I am not a fan of using useEffect for backend API but I couldn't get query to work for this 
  useEffect(() => {
    const fetchData = async () => {
      if (empId) {
        try {
          const fetchedEmployee = await fetchEmployee(empId);
          console.log(fetchedEmployee);
          setEmployee({
            ...fetchedEmployee,
            id: fetchedEmployee.id || '', 
            start_date: fetchedEmployee.start_date || '',
          });
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      }
    };

    fetchData();
  }, [empId]);

  const mutation = useMutation({
    mutationFn: empId ? () => updateEmployee(empId, employee) : () => createEmployee(employee),
    onSuccess: () => navigate('/employees'), 
    onError: (error) => {
      alert(`Error: ${error.message}`); 
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({ ...prevEmployee, [name]: value }));
    setUnsavedChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  const handleCancel = () => {
    if (unsavedChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    navigate('/employees'); 
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh', padding: 2 }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 800, minHeight: '600px' }}>
        <Typography variant="h4" gutterBottom>
          {empId ? 'Edit Employee' : 'Add New Employee'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="grid" gap={2}>
            <TextField
              name="id"
              label="Employee ID"
              value={employee.id}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              size="small"
              disabled={!!empId} 
            />
            <TextField
              name="name"
              label="Name"
              value={employee.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              size="small"
            />
            <TextField
              name="email_address"
              label="Email"
              value={employee.email_address}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              size="small"
            />
            <TextField
              name="phone_number"
              label="Phone Number"
              value={employee.phone_number}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              size="small"
            />
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={employee.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="cafe"
              label="Cafe"
              value={employee.cafe}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              name="start_date"
              label="Start Date (YYYY-MM-DD)"
              value={employee.start_date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              placeholder="YYYY-MM-DD"
            />
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button onClick={handleCancel} variant="outlined" color="secondary">
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddEditEmployeePage;
