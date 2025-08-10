// frontend/src/components/Footer.jsx (Updated to use Logo component)
import React from 'react';
import {
  Box, Container, Grid, Stack, Typography
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
      py: 8, 
      px: 2, 
      backgroundColor: 'rgba(15, 23, 42, 0.8)', 
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid', 
      borderColor: 'rgba(51, 65, 85, 0.5)',
    }}
  >
    <Container maxWidth="lg">
      <Grid container spacing={6}>
        
        {/* Company Info Section - Now using Logo component */}
        <Grid item xs={12} md={5}>
          <Box sx={{ mb: 2 }}>
            <Logo 
              size="medium" 
              variant="white" 
              showSubtitle={true}
              clickable={true}
              onClick={() => {
                // Scroll to top or navigate to home
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </Box>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Revolutionizing vehicle servicing with cutting-edge technology and unmatched customer experience.
          </Typography>
        </Grid>
        
        {/* Contact Information */}
        <Grid item xs={12} sm={6} md={3.5}>
          <Typography variant="h6" component="h4" sx={{ mb: 3 }}>
            Contact Information
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <MapPinIcon sx={{ color: 'primary.light' }} />
              <Typography color="text.secondary" variant="body2">
                Imaduwa, Galle District, Sri Lanka
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <MailIcon sx={{ color: 'primary.light' }} />
              <Typography color="text.secondary" variant="body2">
                contact@motocare.lk
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <PhoneIcon sx={{ color: 'primary.light' }} />
              <Typography color="text.secondary" variant="body2">
                (+94) XX XXX XXXX
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        
        {/* Our Services */}
        <Grid item xs={12} sm={6} md={3.5}>
          <Typography variant="h6" component="h4" sx={{ mb: 3 }}>
            Our Services
          </Typography>
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />
              <Typography color="text.secondary" variant="body2">
                Comprehensive Diagnostics
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />
              <Typography color="text.secondary" variant="body2">
                Scheduled Maintenance
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />
              <Typography color="text.secondary" variant="body2">
                Emergency Repair Solutions
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />
              <Typography color="text.secondary" variant="body2">
                Digital Service Records
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      
      {/* Copyright Section */}
      <Box sx={{ 
        mt: 8, 
        pt: 4, 
        borderTop: 1, 
        borderColor: 'rgba(51, 65, 85, 0.5)', 
        textAlign: 'center' 
      }}>
        <Typography color="text.secondary" variant="body2">
          © {new Date().getFullYear()} Moto-Care (Pvt) Ltd. All Rights Reserved.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer;