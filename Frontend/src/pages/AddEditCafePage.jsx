import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Paper, Typography, FormControl, Input, FormHelperText } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { fetchCafe, createCafe, updateCafe } from '../api/api';

const AddEditCafePage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [cafe, setCafe] = useState({ name: '', description: '', logo: '', location: '' });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);


  //I am not a fan of using useEffect for backend API but I couldn't get query to work for this 
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const fetchedCafe = await fetchCafe(id);
          setCafe(fetchedCafe);
          setLogoPreview(fetchedCafe.logo);
        } catch (error) {
          console.error('Error fetching cafe data:', error);
        }
      }
    };

    fetchData();
  }, [id]);

  const mutation = useMutation({
    mutationFn: id ? () => updateCafe(id, cafe) : () => createCafe(cafe),
    onSuccess: () => navigate('/'),
    onError: (error) => console.error('Mutation error:', error),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCafe((prevCafe) => ({ ...prevCafe, [name]: value }));
    setUnsavedChanges(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCafe((prevCafe) => ({ ...prevCafe, logo: reader.result }));
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
    navigate('/');
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
          {id ? 'Edit Cafe' : 'Add New Cafe'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="grid" gap={2}>
            <TextField
              name="name"
              label="Name"
              value={cafe.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              size="small"
            />
            <TextField
              name="description"
              label="Description"
              value={cafe.description}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              size="small"
              multiline
              rows={4}
            />
            <FormControl fullWidth>
              <Typography variant="h6" gutterBottom>
                Logo
              </Typography>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <FormHelperText>Max file size: 2MB</FormHelperText>
              {logoPreview && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Image Preview:</Typography>
                  <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} />
                </Box>
              )}
            </FormControl>
            <TextField
              name="location"
              label="Location"
              value={cafe.location}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              size="small"
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

export default AddEditCafePage;
