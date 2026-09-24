import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Button, Chip, FormControl,
  InputLabel, Select, MenuItem, TextField, InputAdornment, Stack,
  Alert, ThemeProvider, CssBaseline, GlobalStyles
} from '@mui/material';
import {
  Search as SearchIcon, Build as ServiceIcon, Schedule as ScheduleIcon,
  AttachMoney as PriceIcon, DirectionsCar as CarIcon, Clear as ClearIcon,
  BookOnline as BookIcon, FilterList as FilterIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

import PageHeaderBanner from '../components/PageHeaderBanner';
import { theme, backgroundKeyframes } from '../utils/theme';

// Map vehicleType → a curated Unsplash automotive image
const SERVICE_IMAGES = {
  'Car':         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75&auto=format&fit=crop',
  'Van':         'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=75&auto=format&fit=crop',
  'SUV':         'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=75&auto=format&fit=crop',
  'Motorcycle':  'https://images.unsplash.com/photo-1558981285-6f0c68243fc8?w=600&q=75&auto=format&fit=crop',
  'Three Wheel': 'https://images.unsplash.com/photo-1572535641234-64f09a81a72e?w=600&q=75&auto=format&fit=crop',
  'default':     'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=75&auto=format&fit=crop',
};

const getServiceImage = (vehicleType) => SERVICE_IMAGES[vehicleType] || SERVICE_IMAGES['default'];


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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', background: '#FFFFFF' }}>

          <Header navItems={['Home', 'Services', 'About', 'Contact']} />
          <Box sx={{ pt: { xs: '76px', md: '116px' } }}>
            <PageHeaderBanner
              title="Our Services"
              breadcrumb="Services"
              imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80&auto=format&fit=crop"
            />
          </Box>
          <Box sx={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{
                width: 64, height: 64, borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: '#D32F2F',
                borderRightColor: '#E5E7EB',
                animation: 'mc-spin 0.8s linear infinite',
                mx: 'auto', mb: 3,
              }} />
              <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', fontSize: '0.95rem' }}>Loading services...</Typography>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={backgroundKeyframes} />
      <Box sx={{ minHeight: '100vh', background: '#FFFFFF', position: 'relative' }}>

        <Header navItems={['Home', 'Services', 'About', 'Contact']} />

        {/* Page Header Banner */}
        <Box sx={{ pt: { xs: '76px', md: '116px' } }}>
          <PageHeaderBanner
            title="Our Services"
            breadcrumb="Services"
            imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80&auto=format&fit=crop"
          />
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}>

          {/* Intro */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D32F2F', fontFamily: '"Inter", sans-serif', mb: 1.5 }}>
              What We Offer
            </Typography>
            <Typography variant="h2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 900, fontSize: { xs: '2rem', md: '2.6rem' }, color: '#111827', mb: 2 }}>
              Our Services
            </Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', fontSize: { xs: '0.95rem', md: '1.05rem' }, maxWidth: 560, mx: 'auto', lineHeight: 1.75 }}>
              Discover our comprehensive range of automotive services designed to keep your vehicle
              running smoothly and safely on the road.
            </Typography>
          </Box>


          {/* Filters Section */}
          <Box
            sx={{
              p: 3, mb: 4, borderRadius: '16px',
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={2.5}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px',
                background: '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FilterIcon sx={{ color: '#D32F2F', fontSize: '1.1rem' }} />
              </Box>
              <Typography sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700, fontSize: '1rem', color: '#111827',
              }}>
                Filter Services
              </Typography>
              {(searchTerm || selectedVehicleType !== 'All' || priceSort) && (
                <Button
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  size="small"
                  sx={{
                    ml: 'auto', color: '#6B7280',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.82rem', textTransform: 'none',
                    borderRadius: '8px',
                    '&:hover': { color: '#D32F2F', background: '#FEE2E2' }
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Stack>

            <Grid container spacing={2}>
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
                        <SearchIcon sx={{ color: '#8B95A8' }} />
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
                      <MenuItem key={type} value={type}>{type}</MenuItem>
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
          </Box>

          {/* Error Display */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3, borderRadius: '12px',
                background: 'rgba(229, 62, 62, 0.1)',
                border: '1px solid rgba(229, 62, 62, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          {/* Results Count */}
          <Box
            sx={{
              p: 2.5, mb: 3, borderRadius: '12px',
              background: '#F8F9FB',
              border: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: 2,
            }}
          >
            <Box>
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                color: '#D32F2F', fontWeight: 700, fontSize: '0.95rem',
              }}>
                {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                {selectedVehicleType !== 'All' && ` for ${selectedVehicleType}`}
              </Typography>
              {searchTerm && (
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  color: '#6B7280', fontSize: '0.82rem', mt: 0.3,
                }}>
                  Showing results for "{searchTerm}"
                </Typography>
              )}
            </Box>
            {filteredServices.length > 0 && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  color: '#6B7280', fontSize: '0.82rem',
                }}>
                  Price Range: LKR {Math.min(...filteredServices.map(s => s.price))} –{' '}
                  LKR {Math.max(...filteredServices.map(s => s.price))}
                </Typography>
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  color: '#6B7280', fontSize: '0.82rem',
                }}>
                  Avg. Duration: {Math.round(filteredServices.reduce((acc, s) => acc + s.duration, 0) / filteredServices.length)} min
                </Typography>
              </Box>
            )}
          </Box>

          {/* Services Grid */}
          {filteredServices.length === 0 && !loading ? (
            <Box
              sx={{
                p: 8, textAlign: 'center',
                borderRadius: '20px',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <Box sx={{
                width: 72, height: 72, borderRadius: '20px',
                background: '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 3,
              }}>
                <ServiceIcon sx={{ fontSize: 36, color: '#D32F2F' }} />
              </Box>
              <Typography sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 700, color: '#111827', fontSize: '1.2rem', mb: 1,
              }}>
                No services found
              </Typography>
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                color: '#6B7280', fontSize: '0.9rem', mb: 3,
              }}>
                Try adjusting your filters or search terms
              </Typography>
              <Button
                variant="outlined"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                sx={{
                  borderRadius: '10px',
                  borderColor: '#E5E7EB',
                  color: '#D32F2F',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600, textTransform: 'none',
                  '&:hover': {
                    borderColor: '#D32F2F',
                    background: '#FEE2E2',
                  }
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredServices.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service._id}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '18px',
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 20px 48px rgba(0,0,0,0.14)',
                        '& .svc-img-thumb': { transform: 'scale(1.07)' },
                      },
                    }}
                  >
                    {/* Popular badge */}
                    {service.price <= 3000 && (
                      <Box sx={{ position: 'absolute', top: 14, right: 14, px: 1.5, py: 0.4, borderRadius: '100px', background: '#D32F2F', zIndex: 2 }}>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.7rem', fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Popular</Typography>
                      </Box>
                    )}
                    {/* Text content */}
                    <Box sx={{ p: 3, flexGrow: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                        <Typography variant="h6" component="h2" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#111827', pr: 1, lineHeight: 1.3, mt: service.price <= 3000 ? 2.5 : 0 }}>
                          {service.name}
                        </Typography>
                        <Chip label={service.vehicleType} size="small"
                          sx={{ bgcolor: `${getVehicleTypeColor(service.vehicleType)}18`, color: getVehicleTypeColor(service.vehicleType), border: `1px solid ${getVehicleTypeColor(service.vehicleType)}33`, fontWeight: 700, flexShrink: 0, fontSize: '0.72rem', mt: service.price <= 3000 ? 2.5 : 0 }}
                        />
                      </Stack>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#4B5563', fontSize: '0.87rem', lineHeight: 1.7, minHeight: 52 }}>
                        {service.description || 'Professional service for your vehicle'}
                      </Typography>
                    </Box>
                    {/* Image footer */}
                    <Box sx={{ position: 'relative', height: 160, overflow: 'hidden', flexShrink: 0 }}>
                      <Box
                        className="svc-img-thumb"
                        sx={{ position: 'absolute', inset: 0, backgroundImage: `url("${getServiceImage(service.vehicleType)}")`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.45s ease' }}
                      />
                      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
                      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2 }}>
                        <Stack direction="row" spacing={2} sx={{ mb: 1.2 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <ScheduleIcon sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.72)' }} />
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{service.duration} min</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <PriceIcon sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.72)' }} />
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', color: '#fff', fontWeight: 700 }}>LKR {service.price}</Typography>
                          </Stack>
                        </Stack>
                        <Button fullWidth variant="contained" startIcon={<BookIcon />} onClick={() => handleBookService(service)}
                          sx={{ py: 1.1, borderRadius: '10px', background: '#D32F2F', fontFamily: '"Inter", sans-serif', fontWeight: 700, textTransform: 'none', fontSize: '0.88rem', boxShadow: '0 4px 14px rgba(211,47,47,0.5)', '&:hover': { background: '#B71C1C' } }}>
                          Book This Service
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {/* CTA Section */}
          {filteredServices.length > 0 && (
            <Box
              sx={{
                p: { xs: 4, md: 6 }, mt: 8,
                borderRadius: '22px',
                textAlign: 'center',
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                position: 'relative', overflow: 'hidden',
                '&::before': {
                  content: '""', position: 'absolute',
                  top: 0, left: 0, right: 0, height: '3px',
                  background: '#D32F2F',
                }
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800, color: '#111827',
                  mb: 1.5, fontSize: { xs: '1.4rem', md: '1.8rem' },
                }}
              >
                Ready to Book a Service?
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  color: '#6B7280', mb: 4,
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                }}
              >
                Choose from our wide range of professional automotive services
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<BookIcon />}
                onClick={() => navigate('/booking')}
                sx={{
                  px: 5, py: 1.6,
                  borderRadius: '14px',
                  background: '#D32F2F',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700, textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(211, 47, 47, 0.35)',
                  '&:hover': {
                    background: '#B71C1C',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(211, 47, 47, 0.45)',
                  },
                }}
              >
                Start Booking Process
              </Button>
            </Box>
          )}
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default ServicesPage;