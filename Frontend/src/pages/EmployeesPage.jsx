import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { fetchEmployees, deleteEmployee } from '../api/api';

const EmployeesPage = () => {
  const [filter, setFilter] = useState(''); 
  const queryClient = useQueryClient(); 

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']); 
    },
    onError: (error) => console.error('Delete error:', error),
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const filteredEmployees = filter
    ? employees?.filter(employee =>
      employee.cafe.toLowerCase().includes(filter.toLowerCase())
    ) || []
    : employees || [];

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email_address', headerName: 'Email', width: 200 },
    { field: 'phone_number', headerName: 'Phone Number', width: 150 },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 120,
      renderCell: (params) => params.row.gender,
    },
    { field: 'daysWorked', headerName: 'Days Worked', width: 150 },
    {
      field: 'cafe',
      headerName: 'Café',
      width: 250, 
      renderCell: (params) => {
 
        const cafe = params.row.EmployeeCafes?.[0]?.Cafe?.cafe || 'N/A'; 
        return cafe;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '12px', mt: '18px' }}>
          <Button variant="contained" color="primary" href={`/employee/edit/${params.row.id}`}>
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Box>
      ),
    },
  ];


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
          Employee Manager
        </Typography>
      </Box>
      <TextField
        label="Filter by Name"
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2, width: '300px' }}
      />
      <Button variant="contained" color="primary" href="/employee/add" sx={{ mb: 2, width: '300px', fontWeight: 'bold' }}>
        Add New Employee
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
              overflow: 'auto', 
              maxWidth: '200px', 
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

export default EmployeesPage;
