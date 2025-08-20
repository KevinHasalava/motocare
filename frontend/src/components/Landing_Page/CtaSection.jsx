// frontend/src/components/CtaSection.jsx
import React from 'react';
import {
  Box, Container, Paper, Typography, Button
} from '@mui/material';
import { gradientText } from '../../utils/theme';

const CtaSection = ({ onBookNowClick, theme }) => (
  <Box component="section" sx={{ py: 12 }}>
    <Container maxWidth="md">
      <Paper sx={{
        p: { xs: 4, md: 8 }, 
        textAlign: 'center', 
        borderRadius: 4, 
        border: '1px solid',
        borderColor: 'primary.dark', 
        background: `linear-gradient(to right, rgba(29, 78, 216, 0.2), rgba(126, 34, 206, 0.2))`
      }}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}
        >
          Ready to <Box component="span" sx={gradientText}>Upgrade</Box> Your Experience?
        </Typography>
        
        <Typography 
          color="text.secondary" 
          sx={{ mb: 5, maxWidth: '600px', mx: 'auto' }}
        >
          Join thousands of satisfied customers who've made the switch to intelligent vehicle care.
        </Typography>
        
        <Button
          onClick={onBookNowClick} 
          size="large"
          sx={{
            px: 5, 
            py: 2, 
            fontSize: '1.2rem',
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white', 
            '&:hover': { 
              transform: 'scale(1.05)', 
              boxShadow: `0 8px 25px ${theme.palette.primary.dark}` 
            }
          }}
        >
          Book Your Service Today
        </Button>
      </Paper>
    </Container>
  </Box>
);

export default CtaSection;