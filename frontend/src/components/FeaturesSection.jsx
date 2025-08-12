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
      
      {/* Option 1: 2x2 Grid Layout (Recommended for 4 items) */}
      {/* <Grid 
        container 
        spacing={4} 
        sx={{ 
          maxWidth: '900px', 
          mx: 'auto',
          justifyContent: 'center'
        }}
      >
        {features.map((feature, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={6}
            key={feature.title}
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Fade in={isVisible} timeout={1000} style={{ transitionDelay: `${index * 150}ms` }}>
              <Paper
                elevation={4}
                sx={{
                  p: 4, 
                  height: '100%',
                  width: '100%',
                  maxWidth: '400px', // Constrain maximum width
                  border: '1px solid', 
                  borderColor: 'rgba(51, 65, 85, 0.5)',
                  backdropFilter: 'blur(10px)', 
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
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
                <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Fade>
          </Grid>
        ))}
      </Grid> */}

      {/* Alternative Option 2: Single Row with Better Spacing  */}
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Grid 
          container 
          spacing={3}
          sx={{ justifyContent: 'center' }}
        >
          {features.map((feature, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3}
              key={feature.title}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Fade in={isVisible} timeout={1000} style={{ transitionDelay: `${index * 150}ms` }}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3, 
                    height: '100%',
                    width: '100%',
                    maxWidth: '280px',
                    border: '1px solid', 
                    borderColor: 'rgba(51, 65, 85, 0.5)',
                    backdropFilter: 'blur(10px)', 
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
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
                    mb: 2, 
                    display: 'inline-block',
                    background: feature.gradient, 
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 2, fontSize: '1.1rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flexGrow: 1 }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
     
    </Container>
  </Box>
);

export default FeaturesSection;