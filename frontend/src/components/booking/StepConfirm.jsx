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
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
                borderRadius: 4,
                border: '1px solid',
                borderColor: alpha('#fff', 0.1),
              }}
            >
              {/* Header */}
              <Box sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CheckCircleIcon sx={{ color: 'white', fontSize: 32 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                      Confirm Your Booking
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.9) }}>
                      Please review your booking details carefully.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  {/* Vehicle and Service left */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                      {/* Vehicle */}
                      <Paper sx={{ p: 2.5, background: alpha('#667eea', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#667eea', 0.2) }}>
                        <Stack direction="row" spacing={2}>
                          <Box sx={{ fontSize: 32 }}>{getVehicleIcon(vehicle?.type)}</Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Vehicle</Typography>
                            <Typography variant="h6" sx={{ color: 'white' }}>
                              {vehicle?.brand} {vehicle?.model}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {vehicle?.vehicleNumber}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>

                      {/* Service */}
                      <Paper sx={{ p: 2.5, background: alpha('#a855f7', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#a855f7', 0.2) }}>
                        <Stack direction="row" spacing={2}>
                          <BuildIcon sx={{ color: '#a855f7' }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Service</Typography>
                            <Typography variant="h6" sx={{ color: 'white' }}>{service?.name}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Price: Rs.{service?.price}</Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Stack>
                  </Grid>

                  {/* Mechanic and Date/Time */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                      {/* Mechanic */}
                      <Paper sx={{ p: 2.5, background: alpha('#10b981', 0.05), borderRadius: 2, border: '1px solid', borderColor: alpha('#10b981', 0.2) }}>
                        <Stack direction="row" spacing={2}>
                          <Avatar sx={{ bgcolor: '#10b981' }}>{mechanic?.name?.charAt(0).toUpperCase()}</Avatar>
                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Mechanic</Typography>
                            <Typography variant="h6" sx={{ color: 'white' }}>{mechanic?.name}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {mechanic?.specialization || 'General Mechanic'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>

                      {/* Date & Time */}
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2.5, background: alpha('#3b82f6', 0.05), border: '1px solid', borderColor: alpha('#3b82f6', 0.2) }}>
                            <CalendarMonthIcon sx={{ color: '#3b82f6' }} />
                            <Typography variant="h6" sx={{ color: 'white' }}>{date.format("DD MMM")}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{date.format("YYYY")}</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2.5, background: alpha('#ec4899', 0.05), border: '1px solid', borderColor: alpha('#ec4899', 0.2) }}>
                            <AccessTimeIcon sx={{ color: '#ec4899' }} />
                            <Typography variant="h6" sx={{ color: 'white' }}>{time?.format("HH:mm")}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Duration: ~{service?.duration} mins
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Terms & Conditions section */}
                <Box mt={4} sx={{ background: alpha('#000', 0.2), p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: 'white', mb: 1 }}>
                    Terms & Conditions
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
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
                        sx={{ color: '#10b981', '&.Mui-checked': { color: '#10b981' } }}
                      />
                    }
                    label={<Typography sx={{ color: 'white' }}>I accept the Terms & Conditions</Typography>}
                  />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined" onClick={onBack} sx={{ color: 'white' }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={onConfirm}
                    disabled={!agree}   // 🔒 confirm only if ticked
                    sx={{
                      background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                      '&.Mui-disabled': { background: alpha('#fff', 0.2), color: alpha('#fff', 0.5) },
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