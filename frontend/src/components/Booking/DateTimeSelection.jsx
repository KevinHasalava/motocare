import React, { useState, useEffect } from "react";
import {
  Typography, Box, Grid, Paper, Button,
  TextField, MenuItem, Stack, Fade, alpha
} from "@mui/material";
import {
  Schedule as TimeIcon, Engineering as MechanicIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { theme } from "../../utils/theme";

const DateTimeSelection = ({
  selectedDate, setSelectedDate,
  selectedTime, setSelectedTime,
  selectedMechanic, setSelectedMechanic,
  mechanics, onBack, onNext
}) => {
  const [bookedSlots, setBookedSlots] = useState([]);

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 17; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (selectedDate) {
      // Mock booked slots - replace with API call
      setBookedSlots(["10:00", "11:30", "14:00"]);
    }
  }, [selectedDate]);

  const isSlotAvailable = (slot) => {
    return !bookedSlots.includes(slot);
  };

  return (
    <Fade in>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: theme.palette.text.primary }}>
          Schedule Your Service
        </Typography>

        <Grid container spacing={4}>
          {/* Calendar */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: theme.palette.background.paper,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.2),
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  minDate={new Date()}
                  sx={{
                    '& .MuiPickersDay-root': {
                      color: theme.palette.text.primary,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Paper>
          </Grid>

          {/* Time Slots & Mechanic */}
          <Grid item xs={12} md={6}>
            {selectedDate && (
              <Fade in>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    Available Time Slots
                  </Typography>
                  <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    {timeSlots.map((slot) => (
                      <Grid item xs={4} sm={3} key={slot}>
                        <Button
                          fullWidth
                          variant={selectedTime === slot ? "contained" : "outlined"}
                          disabled={!isSlotAvailable(slot)}
                          onClick={() => setSelectedTime(slot)}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            backgroundColor: !isSlotAvailable(slot) 
                              ? alpha(theme.palette.error.main, 0.1)
                              : selectedTime === slot 
                                ? theme.palette.primary.main
                                : 'transparent',
                            borderColor: !isSlotAvailable(slot)
                              ? theme.palette.error.main
                              : selectedTime === slot
                                ? theme.palette.primary.main
                                : alpha(theme.palette.primary.main, 0.3),
                            color: !isSlotAvailable(slot)
                              ? theme.palette.error.main
                              : selectedTime === slot
                                ? '#fff'
                                : theme.palette.text.primary,
                            '&:hover': {
                              backgroundColor: !isSlotAvailable(slot)
                                ? alpha(theme.palette.error.main, 0.1)
                                : alpha(theme.palette.primary.main, 0.2),
                            },
                          }}
                        >
                          {slot}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>

                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    Prefer a Mechanic? (Optional)
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={selectedMechanic?._id || ''}
                    onChange={(e) => {
                      const mechanic = mechanics.find(m => m._id === e.target.value);
                      setSelectedMechanic(mechanic || null);
                    }}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <MechanicIcon sx={{ color: theme.palette.text.secondary }} />
                        <Typography>Auto-assign mechanic</Typography>
                      </Stack>
                    </MenuItem>
                    {mechanics.map((mechanic) => (
                      <MenuItem key={mechanic._id} value={mechanic._id}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <MechanicIcon sx={{ color: theme.palette.primary.main }} />
                          <Typography>{mechanic.name}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>

                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: alpha(theme.palette.info.main, 0.05),
                      border: '1px solid',
                      borderColor: alpha(theme.palette.info.main, 0.2),
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimeIcon sx={{ color: theme.palette.info.main }} />
                      <Typography sx={{ fontSize: '0.9rem', color: theme.palette.text.secondary }}>
                        Red slots are unavailable. {selectedMechanic ? 
                          `Showing availability for ${selectedMechanic.name}` : 
                          'System will auto-assign the best available mechanic'}
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              </Fade>
            )}
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onBack}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            size="large"
            endIcon={<NextIcon />}
            disabled={!selectedDate || !selectedTime}
            onClick={onNext}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Review Booking
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default DateTimeSelection;