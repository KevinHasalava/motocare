import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, Grid, Paper,
  Stack, Typography, Fade, alpha, Avatar, Checkbox, FormControlLabel
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EngineeringIcon from '@mui/icons-material/Engineering';

const StepConfirm = ({ vehicle, service, date, time, mechanic, onBack, onConfirm }) => {
  const [agree, setAgree] = useState(false); // 👈 T&C accept state

  const getVehicleIcon = (type) => {
    const icons = {
      car: '🚗',
      motorcycle: '🏍️',
      'three wheel': '🛺',
      truck: '🚛',
      bus: '🚌',
      van: '🚐',
      suv: '🚙',
    };
    return icons[type?.toLowerCase()] || '🚗';
  };

  return (
    <Fade in timeout={600}>
      <Box>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
            <Card
              sx={{
                background: '#FFFFFF',
                borderRadius: 4,
                border: '1px solid #E2E8F0',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <Box sx={{ background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)', p: 3.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircleIcon sx={{ color: 'white', fontSize: 34 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                      Confirm Your Booking
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)', mt: 0.5 }}>
                      Please review your booking details carefully before confirming.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Grid container spacing={3}>
                  {/* Vehicle and Service left */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                      {/* Vehicle */}
                      <Paper sx={{ p: 2.5, background: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ fontSize: 36 }}>{getVehicleIcon(vehicle?.type)}</Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vehicle</Typography>
                            <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>
                              {vehicle?.brand} {vehicle?.model}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
                              {vehicle?.vehicleNumber}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>

                      {/* Service */}
                      <Paper sx={{ p: 2.5, background: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'rgba(211, 47, 47, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BuildIcon sx={{ color: '#D32F2F', fontSize: 24 }} />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service</Typography>
                            <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>{service?.name}</Typography>
                            <Typography variant="body2" sx={{ color: '#D32F2F', fontWeight: 700 }}>Price: LKR {service?.price}</Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Stack>
                  </Grid>

                  {/* Mechanic and Date/Time */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                      {/* Mechanic */}
                      <Paper sx={{ p: 2.5, background: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: '#D32F2F', width: 44, height: 44, fontWeight: 700 }}>{mechanic?.name?.charAt(0).toUpperCase() || 'M'}</Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mechanic</Typography>
                            <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>{mechanic?.name || 'Any Available Mechanic'}</Typography>
                            <Typography variant="body2" sx={{ color: '#64748B' }}>
                              {mechanic?.specialization || 'General Technician'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>

                      {/* Date & Time */}
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2.5, background: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                            <CalendarMonthIcon sx={{ color: '#D32F2F', mb: 0.5 }} />
                            <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>{date ? date.format("DD MMM") : '-'}</Typography>
                            <Typography variant="body2" sx={{ color: '#64748B' }}>{date ? date.format("YYYY") : ''}</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2.5, background: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                            <AccessTimeIcon sx={{ color: '#D32F2F', mb: 0.5 }} />
                            <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>{time ? time.format("HH:mm") : '-'}</Typography>
                            <Typography variant="body2" sx={{ color: '#64748B' }}>
                              Duration: ~{service?.duration || 30} mins
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Terms & Conditions section */}
                <Box mt={4} sx={{ background: '#F8FAFC', p: 3, borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                  <Typography variant="subtitle1" sx={{ color: '#0F172A', fontWeight: 700, mb: 1 }}>
                    Terms & Conditions
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mb: 2, lineHeight: 1.6 }}>
                    • Vehicle must arrive 10 minutes prior to booking time.<br />
                    • Cancellation should be informed at least 2 hours in advance.<br />
                    • Workshop is not responsible for left belongings in the vehicle.<br />
                    • Payment should be settled after service completion.<br />
                  </Typography>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        sx={{ color: '#D32F2F', '&.Mui-checked': { color: '#D32F2F' } }}
                      />
                    }
                    label={<Typography sx={{ color: '#0F172A', fontWeight: 600, fontSize: '0.95rem' }}>I accept the Terms & Conditions</Typography>}
                  />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined" onClick={onBack} sx={{ px: 4, py: 1.5, borderColor: '#CBD5E1', color: '#334155', fontWeight: 600, '&:hover': { borderColor: '#94A3B8', background: '#F1F5F9' } }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={onConfirm}
                    disabled={!agree}   // 🔒 confirm only if ticked
                    sx={{
                      background: '#D32F2F',
                      color: '#FFFFFF',
                      px: 5,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(211, 47, 47, 0.3)',
                      '&:hover': {
                        background: '#B71C1C',
                        boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                      },
                      '&.Mui-disabled': { background: '#E2E8F0', color: '#94A3B8' },
                    }}
                  >
                    Confirm Booking
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default StepConfirm;