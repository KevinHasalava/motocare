// frontend/src/components/HeroSection.jsx
import React from 'react';
import {
  Container, Box, Typography, Button, Stack, Grid, Fade
} from '@mui/material';
import {
  ArrowForward as ArrowRightIcon, PlayArrow as PlayIcon
} from '@mui/icons-material';
import { gradientText } from '../utils/theme';

const HeroSection = ({ isVisible, onBookNowClick, stats, theme }) => (
  <Container 
    maxWidth="lg" 
    sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      pt: 10, 
      textAlign: 'center' 
    }}
  >
    <Fade in={isVisible} timeout={1000}>
      <Box>
        <Typography sx={{ 
          color: 'primary.light', 
          textTransform: 'uppercase', 
          letterSpacing: '0.2em', 
          mb: 2 
        }}>
          Next Generation Auto Care
        </Typography>
        
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, mb: 3 }}
        >
          Experience the <Box component="span" sx={gradientText}>Future</Box>
          <br />
          of Vehicle Servicing
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto', 
            mb: 6, 
            lineHeight: 1.7 
          }}
        >
          Transform your vehicle maintenance experience with our cutting-edge digital platform. 
          Smart scheduling, real-time updates, and premium service quality.
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center" 
          sx={{ mb: 8 }}
        >
          <Button
            onClick={onBookNowClick} 
            size="large" 
            endIcon={<ArrowRightIcon />}
            sx={{
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem',
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white', 
              '&:hover': { 
                transform: 'scale(1.05)', 
                boxShadow: `0 8px 25px ${theme.palette.primary.dark}` 
              }
            }}
          >
            Start Your Journey
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large" 
            startIcon={<PlayIcon />}
            sx={{ 
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem', 
              '&:hover': { 
                transform: 'scale(1.05)', 
                backgroundColor: 'rgba(99, 102, 241, 0.1)' 
              } 
            }}
          >
            Watch Demo
          </Button>
        </Stack>
        
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
  {stats.map((stat) => (
    <Grid 
      item 
      xs={6} 
      md={3} 
      key={stat.label} 
      sx={{ 
        display: 'flex', 
        color: 'text.white',
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        textEmphasisColor: 'black',
        
        // height එක දෙනවා එක height එකකට items සෙමතු කරන්න
        height: '100%', 
        // මේකෙන් items අතර space එක හොඳින් තියෙනවා
        padding: 2, 
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: 'background.white',
      }}
    >
      {stat.icon}
      <Typography 
        variant="h4" 
        component="div" 
        sx={{ 
          fontWeight: 'bold',  // black වෙනුවට bold හොඳයි readability එකට
          mt: 1, 
          lineHeight: 1.2,
          color: 'primary.main'
        }}
      >
        {stat.value}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        {stat.label}
      </Typography>
    </Grid>
  ))}
</Grid>


      </Box>
    </Fade>
  </Container>
);

export default HeroSection;