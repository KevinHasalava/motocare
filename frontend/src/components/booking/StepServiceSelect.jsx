import React from 'react';
import {
  Box, Button, Card, CardContent, Grid, Stack,
  Typography, Chip, Zoom, Fade, alpha, Paper
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NoCrashIcon from '@mui/icons-material/NoCrash'; 
import { theme } from '../../utils/theme';



const StepServiceSelect = ({ services, service, setService, onNext, onBack, selectedVehicle }) => {


  const filteredServices = selectedVehicle
    ? services.filter(s => s.vehicleType === selectedVehicle.type)
    : []; 

  return (
    <Fade in timeout={600}>
      <Box>
        <Grid container spacing={3}>
          {filteredServices.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 5, textAlign: 'center', background: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <NoCrashIcon sx={{ fontSize: 60, color: '#94A3B8' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#0F172A', fontWeight: 700 }}>
                  No Services Available
                </Typography>
                <Typography sx={{ color: '#64748B', mt: 0.5 }}>
                  There are no specific services listed for the selected vehicle type: '{selectedVehicle?.type || 'N/A'}'.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            filteredServices.map((s, index) => (
              <Grid item xs={12} sm={6} md={4} key={s._id}>
                <Zoom in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      height: '100%',
                      background: service?._id === s._id
                        ? '#FEF2F2'
                        : '#FFFFFF',
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: service?._id === s._id ? '#D32F2F' : '#E2E8F0',
                      boxShadow: service?._id === s._id ? '0 10px 25px -5px rgba(211, 47, 47, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                        borderColor: service?._id === s._id ? '#D32F2F' : '#CBD5E1',
                      }
                    }}
                    onClick={() => setService(s)}
                  >
                    <CardContent sx={{ p: 3, position: 'relative' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'linear-gradient(135deg, #D32F2F 0%, #E53935 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(211, 47, 47, 0.25)' }}>
                          <BuildIcon sx={{ color: 'white', fontSize: 22 }} />
                        </Box>
                        {service?._id === s._id && <CheckCircleIcon sx={{ color: '#D32F2F', fontSize: 26 }} />}
                      </Stack>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0F172A' }}>
                        {s.name}
                      </Typography>
                      <Chip label={s.vehicleType} size="small" sx={{ mb: 2, backgroundColor: 'rgba(211, 47, 47, 0.08)', color: '#D32F2F', fontWeight: 600, fontSize: '0.75rem' }} />
                      {s.description && (
                        <Typography variant="body2" sx={{ color: '#64748B', mb: 2, minHeight: '40px', lineHeight: 1.5 }}>
                          {s.description}
                        </Typography>
                        
                      )}
                      <Chip label={`LKR ${s.price.toFixed(2)}`} sx={{ background: '#0F172A', color: 'white', fontWeight: 700, fontSize: '0.9rem' }} />
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))
          )}
        </Grid>

        {/* Navigation buttons */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={onBack} sx={{ px: 4, py: 1.5, borderColor: '#CBD5E1', color: '#334155', fontWeight: 600, '&:hover': { borderColor: '#94A3B8', background: '#F1F5F9' } }}>
            Back
          </Button>
          <Button variant="contained" disabled={!service} onClick={onNext} sx={{ background: '#D32F2F', px: 4, py: 1.5, fontSize: '1rem', fontWeight: 700, boxShadow: '0 4px 14px rgba(211, 47, 47, 0.3)', '&:hover': { background: '#B71C1C' }, '&.Mui-disabled': { background: '#E2E8F0', color: '#94A3B8' } }}>
            Next
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default StepServiceSelect;