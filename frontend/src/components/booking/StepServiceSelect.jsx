import React from 'react';
import {
  Box, Button, Card, CardContent, Grid, Stack,
  Typography, Chip, Zoom, Fade, alpha
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StepServiceSelect = ({ services, service, setService, onNext, onBack }) => {
  return (
    <Fade in timeout={600}>
      <Box>
        <Grid container spacing={3}>
          {services.map((s, index) => (
            <Grid item xs={12} sm={6} md={4} key={s._id}>
              <Zoom in timeout={300 + index * 100}>
                <Card
                  sx={{
                    cursor: "pointer",
                    height: '100%',
                    background: service?._id === s._id 
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: service?._id === s._id ? 'primary.main' : alpha('#fff', 0.1),
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    }
                  }}
                  onClick={() => setService(s)}
                >
                  {/* Decorative Background */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -30,
                      right: -30,
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${alpha('#6366f1', 0.2)} 0%, ${alpha('#a855f7', 0.2)} 100%)`,
                      filter: 'blur(30px)',
                    }}
                  />
                  
                  <CardContent sx={{ p: 3, position: 'relative' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        }}
                      >
                        <BuildIcon sx={{ color: 'white' }} />
                      </Box>
                      {service?._id === s._id && (
                        <CheckCircleIcon sx={{ color: 'primary.main' }} />
                      )}
                    </Stack>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: 'white',
                      }}
                    >
                      {s.name}
                    </Typography>
                    
                    {s.description && (
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {s.description}
                      </Typography>
                    )}
                    
                    <Chip
                      label={`₹${s.price}`}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    />
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            onClick={onBack}
            sx={{
              px: 4,
              py: 1.5,
              borderColor: alpha('#fff', 0.3),
              color: 'white',
              '&:hover': {
                borderColor: alpha('#fff', 0.5),
                background: alpha('#fff', 0.1),
              }
            }}
          >
            Back
          </Button>
          <Button 
            variant="contained" 
            disabled={!service} 
            onClick={onNext}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              }
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default StepServiceSelect;