import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Typography, Box, TextField } from '@mui/material';
import { fetchEmployeesByCafe } from '../api/api'; 
import { useLocation, useNavigate } from 'react-router-dom';

const EmployeesByCafePage = () => {
  const [filter, setFilter] = useState('');
  const location = useLocation();
  const navigate = useNavigate(); 
  const query = new URLSearchParams(location.search);
  const cafeName = query.get('cafe'); 

  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employeesByCafe', cafeName],
    queryFn: () => fetchEmployeesByCafe(cafeName),
    enabled: !!cafeName, 
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email_address', headerName: 'Email', width: 200 },
    { field: 'phone_number', headerName: 'Phone Number', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 120 },
    { field: 'daysWorked', headerName: 'Days Worked', width: 150 },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading employees</div>;

  const filteredEmployees = employees?.filter(employee =>
    employee.daysWorked !== undefined && employee.daysWorked !== null && 
    (filter ? employee.name.toLowerCase().includes(filter.toLowerCase()) : true)
  ) || [];

  return (
    <Container
      sx={{
        marginTop: '20px',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        maxWidth: '100%',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          padding: 2,
          backgroundColor: '#61adff',
          color: 'white',
          borderRadius: '8px',
          width: '97%',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Employees at Cafe {cafeName || 'N/A'}
        </Typography>
      </Box>
      <TextField
        label="Filter by Name"
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2, width: '300px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/cafes')}
        sx={{ mb: 2, width: '300px', fontWeight: 'bold' }}
      >
        Back to Cafes
      </Button>
      <Box
        sx={{
          flex: 1,
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <DataGrid
          rows={filteredEmployees}
          columns={columns}
          pageSize={10}
          rowHeight={80}
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              overflow: 'hidden',
            },
            '& .MuiDataGrid-columnHeaders': {
              fontWeight: 'bold',
              fontSize: '16px',
            },
            '& .MuiDataGrid-columnSeparator': {
              display: 'none',
            },
          }}
        />
      </Box>
    </Container>
  );
};

export default EmployeesByCafePage;
