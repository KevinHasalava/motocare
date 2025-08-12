// frontend/src/components/Footer.jsx (Compact Version)
import React from 'react';
import {
  Box, Container, Grid, Stack, Typography, Divider
} from '@mui/material';
import {
  LocationOn as MapPinIcon, Mail as MailIcon, Phone as PhoneIcon, 
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Logo from './Logo';

const Footer = () => (
  <Box 
    component="footer" 
    id="contact" 
    sx={{
      py: 4, // Reduced from 8 to 4
      px: 2, 
      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid', 
      borderColor: 'rgba(51, 65, 85, 0.5)',
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center"> {/* Reduced spacing from 6 to 4 */}
        
        {/* Company Info Section - Smaller logo */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 1 }}>
            <Logo 
              size="small" // Changed from medium to small
              variant="white" 
              showSubtitle={false} // Hide subtitle to save space
              clickable={true}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </Box>
          <Typography 
            color="text.secondary" 
            variant="body2" // Smaller text
            sx={{ mb: 2, fontSize: '0.875rem' }} // Reduced margin and font size
          >
            Revolutionizing vehicle servicing with cutting-edge technology.
          </Typography>
        </Grid>
        
        {/* Contact Information - More compact */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle1" component="h4" sx={{ mb: 1.5, fontSize: '1rem' }}>
            Contact Info
          </Typography>
          <Stack spacing={1}> {/* Reduced spacing */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <MapPinIcon sx={{ color: 'primary.light', fontSize: '1.1rem' }} />
              <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.8rem' }}>
                Imaduwa, Galle District, Sri Lanka
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <MailIcon sx={{ color: 'primary.light', fontSize: '1.1rem' }} />
              <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.8rem' }}>
                contact@motocare.lk
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PhoneIcon sx={{ color: 'primary.light', fontSize: '1.1rem' }} />
              <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.8rem' }}>
                (+94) XX XXX XXXX
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        
        {/* Our Services - Condensed */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle1" component="h4" sx={{ mb: 1.5, fontSize: '1rem' }}>
            Services
          </Typography>
          <Stack spacing={0.8}> {/* Reduced spacing */}
            {[
              'Comprehensive Diagnostics',
              'Scheduled Maintenance', 
              'Emergency Repairs',
              'Digital Records'
            ].map((service, index) => (
              <Stack key={index} direction="row" alignItems="center" spacing={1}>
                <CheckCircleIcon fontSize="small" sx={{ color: 'success.main', fontSize: '1rem' }} />
                <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.8rem' }}>
                  {service}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
      
      {/* Copyright Section - More compact */}
      <Divider sx={{ my: 3, borderColor: 'rgba(51, 65, 85, 0.5)' }} /> {/* Reduced margin */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} Moto-Care (Pvt) Ltd. All Rights Reserved.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer;