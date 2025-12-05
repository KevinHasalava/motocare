import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Grid, Card, CardContent, CardActions,
  Button, Chip, FormControl, InputLabel, Select, MenuItem, TextField,
  InputAdornment, Stack, CircularProgress, Alert, IconButton, Tooltip,
  Avatar, Divider, ThemeProvider, CssBaseline, GlobalStyles
} from '@mui/material';
import {
  Search as SearchIcon, Build as ServiceIcon, Schedule as ScheduleIcon,
  AttachMoney as PriceIcon, DirectionsCar as CarIcon, Clear as ClearIcon,
  BookOnline as BookIcon, FilterList as FilterIcon, ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { theme, backgroundKeyframes } from '../utils/theme';

const vehicleTypes = ['All', 'Car', 'Van', 'SUV', 'Motorcycle', 'Three Wheel'];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState('All');
  const [priceSort, setPriceSort] = useState('');
  
  const navigate = useNavigate();

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (err) {
        setError('Failed to load services. Please try again.');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter and sort services
  useEffect(() => {
    let filtered = services;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by vehicle type
    if (selectedVehicleType && selectedVehicleType !== 'All') {
      filtered = filtered.filter(service => service.vehicleType === selectedVehicleType);
    }

    // Sort by price
    if (priceSort === 'low-to-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high-to-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedVehicleType, priceSort]);

  // Get vehicle type color
  const getVehicleTypeColor = (type) => {
    const colors = {
      'Car': '#1976d2',
      'Van': '#388e3c',
      'SUV': '#f57c00',
      'Motorcycle': '#d32f2f',
      'Three Wheel': '#7b1fa2'
    };
    return colors[type] || '#757575';
  };

  // Handle book service
  const handleBookService = (service) => {
    // Navigate to booking page with pre-selected service
    navigate('/booking', { state: { preSelectedService: service } });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedVehicleType('All');
    setPriceSort('');
  };

  if (loading) {
    return (
      <>
        <Header navItems={['Home', 'Services', 'Vehicles']} />
        <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={backgroundKeyframes} />
      <Header navItems={['Home', 'Services', 'Vehicles']} />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        {/* Back Button */}
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { 
                bgcolor: 'action.hover',
                color: 'primary.main'
              }
            }}
          >
            Back
          </Button>
        </Box>

        {/* Page Header */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center'
          }}
        >
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} mb={2}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
              <ServiceIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold">
                Our Services
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Professional vehicle maintenance and repair services
              </Typography>
            </Box>
          </Stack>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8 }}>
            Discover our comprehensive range of automotive services designed to keep your vehicle 
            running smoothly and safely on the road.
          </Typography>
        </Paper>

        {/* Filters Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <FilterIcon color="primary" />
            <Typography variant="h6" fontWeight="600">
              Filter Services
            </Typography>
            {(searchTerm || selectedVehicleType !== 'All' || priceSort) && (
              <Button 
                startIcon={<ClearIcon />} 
                onClick={clearFilters}
                size="small"
                sx={{ ml: 'auto' }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>
          
          <Grid container spacing={3}>
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Vehicle Type Filter */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  value={selectedVehicleType}
                  label="Vehicle Type"
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
                >
                  {vehicleTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Price Sort */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Sort by Price</InputLabel>
                <Select
                  value={priceSort}
                  label="Sort by Price"
                  onChange={(e) => setPriceSort(e.target.value)}
                >
                  <MenuItem value="">Default</MenuItem>
                  <MenuItem value="low-to-high">Price: Low to High</MenuItem>
                  <MenuItem value="high-to-low">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Results Count and Stats */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="primary" gutterBottom>
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                {selectedVehicleType !== 'All' && ` for ${selectedVehicleType}`}
              </Typography>
              {searchTerm && (
                <Typography variant="body2" color="text.secondary">
                  Showing results for "{searchTerm}"
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {filteredServices.length > 0 && (
                <Box textAlign={{ xs: 'left', md: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Price Range: LKR {Math.min(...filteredServices.map(s => s.price))} - LKR {Math.max(...filteredServices.map(s => s.price))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Duration: {Math.round(filteredServices.reduce((acc, s) => acc + s.duration, 0) / filteredServices.length)} minutes
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Services Grid */}
        {filteredServices.length === 0 && !loading ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <ServiceIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No services found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Try adjusting your filters or search terms
            </Typography>
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              startIcon={<ClearIcon />}
            >
              Clear All Filters
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service._id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  {/* Popular badge for lower-priced services */}
                  {service.price <= 3000 && (
                    <Chip
                      label="Popular"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: '#ff9800',
                        color: 'white',
                        fontWeight: 600,
                        zIndex: 2,
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, pt: service.price <= 3000 ? 4 : 2 }}>
                    {/* Service Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2} sx={{ minHeight: 32 }}>
                      <Typography variant="h6" component="h2" fontWeight="600" sx={{ pr: 2, lineHeight: 1.2 }}>
                        {service.name}
                      </Typography>
                      <Chip
                        label={service.vehicleType}
                        size="small"
                        sx={{
                          bgcolor: getVehicleTypeColor(service.vehicleType),
                          color: 'white',
                          fontWeight: 600,
                          flexShrink: 0,
                          mt: service.price <= 3000 ? 2 : 0, // Add margin top if popular tag exists
                        }}
                      />
                    </Stack>

                    {/* Service Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 3, minHeight: 40 }}
                    >
                      {service.description || 'Professional service for your vehicle'}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {/* Service Details */}
                    <Stack spacing={1.5}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <ScheduleIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                          <strong>Duration:</strong> {service.duration} minutes
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PriceIcon fontSize="small" color="success" />
                        <Typography variant="body2">
                          <strong>Price:</strong> LKR {service.price}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <CarIcon fontSize="small" sx={{ color: getVehicleTypeColor(service.vehicleType) }} />
                        <Typography variant="body2">
                          <strong>Vehicle:</strong> {service.vehicleType}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<BookIcon />}
                      onClick={() => handleBookService(service)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        },
                      }}
                    >
                      Book This Service
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Call to Action */}
        {filteredServices.length > 0 && (
          <Paper 
            sx={{ 
              p: 4, 
              mt: 6, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Ready to Book a Service?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Choose from our wide range of professional automotive services
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<BookIcon />}
              onClick={() => navigate('/booking')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              Start Booking Process
            </Button>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default ServicesPage;