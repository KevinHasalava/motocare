// frontend/src/components/ProcessSection.jsx
import React from 'react';
import {
  Box, Container, Typography, Stack, Fade
} from '@mui/material';
import { gradientText } from '../../utils/theme';

const ProcessSection = ({ isVisible, processSteps, theme }) => (
  <Box 
    component="section" 
    id="process" 
    sx={{ py: 12, backgroundColor: 'rgba(30, 41, 59, 0.3)' }}
  >
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 10 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ mb: 2, fontSize: { xs: '2.5rem', md: '3.75rem' } }}
        >
          Simple <Box component="span" sx={gradientText}>Process</Box>
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Three easy steps to premium vehicle care
        </Typography>
      </Box>
      
      <Stack spacing={4}>
        {processSteps.map((step, index) => (
          <Fade 
            in={isVisible} 
            timeout={1000} 
            style={{ transitionDelay: `${index * 200}ms` }} 
            key={step.title}
          >
            <Stack direction="row" spacing={4} alignItems="flex-start">
              <Stack alignItems="center">
                <Box sx={{
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: `0 8px 25px ${theme.palette.primary.dark}4D`, 
                  zIndex: 1
                }}>
                  <Typography variant="h4" sx={{ fontWeight: 'black' }}>
                    {index + 1}
                  </Typography>
                </Box>
                {index < processSteps.length - 1 && (
                  <Box sx={{ 
                    width: '2px', 
                    height: '100px', 
                    mt: 2, 
                    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, transparent)` 
                  }} />
                )}
              </Stack>
              
              <Box sx={{ pt: 2 }}>
                <Typography variant="h5" component="h3" sx={{ mb: 1 }}>
                  {step.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ lineHeight: 1.7 }}
                >
                  {step.desc}
                </Typography>
              </Box>
            </Stack>
          </Fade>
        ))}
      </Stack>
    </Container>
  </Box>
);

export default ProcessSection;