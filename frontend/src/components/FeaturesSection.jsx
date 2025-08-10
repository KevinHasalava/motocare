// frontend/src/components/FeaturesSection.jsx
import React from 'react';
import {
  Box, Container, Typography, Grid, Paper, Fade
} from '@mui/material';
import { gradientText } from '../utils/theme';

const FeaturesSection = ({ isVisible, features, theme }) => (
  <Box component="section" id="features" sx={{ py: 12 }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 10 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.75rem' } }}
        >
          Powerful <Box component="span" sx={gradientText}>Features</Box>
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: '600px', mx: 'auto' }}
        >
          Advanced technology meets exceptional service quality
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Fade in={isVisible} timeout={1000} style={{ transitionDelay: `${index * 150}ms` }}>
              <Paper
                elevation={4}
                sx={{
                  p: 4, 
                  height: '100%', 
                  border: '1px solid', 
                  borderColor: 'rgba(51, 65, 85, 0.5)',
                  backdropFilter: 'blur(10px)', 
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)', 
                    borderColor: 'primary.main',
                    boxShadow: `0 10px 20px ${theme.palette.primary.dark}33`,
                  }
                }}
              >
                <Box sx={{
                  p: 1.5, 
                  borderRadius: 3, 
                  mb: 3, 
                  display: 'inline-block',
                  background: feature.gradient, 
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default FeaturesSection;