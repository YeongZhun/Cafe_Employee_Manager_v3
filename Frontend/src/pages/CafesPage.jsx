import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { fetchCafes, deleteCafe } from '../api/api';
import { Link } from 'react-router-dom';

const CafesPage = () => {
  const [filter, setFilter] = useState(''); 
  const queryClient = useQueryClient(); 
  const { data: cafes, isLoading } = useQuery({
    queryKey: ['cafes'],
    queryFn: fetchCafes,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCafe,
    onSuccess: () => {
      queryClient.invalidateQueries(['cafes']); 
    },
    onError: (error) => console.error('Delete error:', error),
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this cafe?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const filteredCafes = filter
    ? cafes
        ?.filter(cafe => cafe.location.toLowerCase().startsWith(filter.toLowerCase()))
        .sort((a, b) => a.location.localeCompare(b.location)) || []
    : cafes
        ?.slice() 
        .sort((a, b) => b.employeeCount - a.employeeCount) || [];

  const columns = [
    {
      field: 'logo',
      headerName: 'Logo',
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <img
            src={params.value}
            alt="Cafe Logo"
            style={{
              width: '100px',
              height: '70px',
              objectFit: 'contain',
              borderRadius: '4px',
            }}
          />
        </Box>
      ),
    },
    { field: 'name', headerName: 'Name', width: 180 },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', mt: '34px' }}>
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { field: 'employeeCount', headerName: 'Employees', width: 130,
      renderCell: (params) => (
        <Link to={`/employees-by-cafe?cafe=${encodeURIComponent(params.row.name)}`} style={{ textDecoration: 'none', color: 'blue' }}>
          {params.value}
        </Link>
      ),
    },
    { field: 'location', headerName: 'Location', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', mt: '26px', mr: '18px' }}>
          <Button variant="contained" color="primary" href={`/cafe/edit/${params.row.id}`}>
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
          Café and Employee Manager
        </Typography>
      </Box>
      <TextField
        label="Filter by Location"
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2, width: '300px' }}
      />
      <Button variant="contained" color="primary" href="/cafe/add" sx={{ mb: 2, width: '300px', fontWeight: 'bold' }}>
        Add New Café
      </Button>
      <Box
        sx={{
          flex: 1, 
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <DataGrid
          rows={filteredCafes}
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

export default CafesPage;
