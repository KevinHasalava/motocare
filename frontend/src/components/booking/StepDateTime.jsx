import React from 'react';
import {
  Box, Button, Grid, Paper, Stack, Typography, Fade, alpha
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const timeSlots = [
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: false },
  { time: "12:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: false },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
];

const StepDateTime = ({ date, setDate, time, setTime, onNext, onBack }) => {
  return (
    <Fade in timeout={600}>
      <Box>
        <Grid container spacing={4}>
          {/* Date Selection */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha('#fff', 0.1),
                p: 3,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CalendarMonthIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                  Select Date
                </Typography>
              </Stack>
              
              <DateCalendar 
                value={date} 
                onChange={(newDate) => setDate(newDate)}
                disablePast
                sx={{
                  backgroundColor: 'transparent',
                  '& .MuiPickersDay-root': {
                    color: 'white',
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    },
                    '&:hover': {
                      background: alpha('#667eea', 0.2),
                    }
                  },
                  '& .MuiDayCalendar-weekDayLabel': {
                    color: 'text.secondary',
                  },
                  '& .MuiPickersCalendarHeader-label': {
                    color: 'white',
                  },
                  '& .MuiPickersArrowSwitcher-button': {
                    color: 'white',
                  },
                }}
              />
            </Paper>
          </Grid>
          
          {/* Time Selection */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha('#fff', 0.1),
                p: 3,
                height: '100%',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AccessTimeIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                  Select Time
                </Typography>
              </Stack>
              
              <Grid container spacing={2}>
                {timeSlots.map((slot) => (
                  <Grid item xs={6} key={slot.time}>
                    <Button
                      fullWidth
                      variant={time?.format("HH:mm") === slot.time ? "contained" : "outlined"}
                      disabled={!slot.available}
                      onClick={() => setTime(dayjs(`2024-01-01 ${slot.time}`))}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: time?.format("HH:mm") === slot.time 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'transparent',
                        borderColor: slot.available 
                          ? alpha('#10b981', 0.5) 
                          : alpha('#ef4444', 0.3),
                        color: !slot.available 
                          ? alpha('#ef4444', 0.7)
                          : time?.format("HH:mm") === slot.time 
                            ? 'white' 
                            : '#10b981',
                        '&:hover': {
                          borderColor: slot.available ? '#10b981' : '',
                          background: slot.available && time?.format("HH:mm") !== slot.time
                            ? alpha('#10b981', 0.1)
                            : '',
                        },
                        '&.Mui-disabled': {
                          background: alpha('#ef4444', 0.1),
                          borderColor: alpha('#ef4444', 0.3),
                          color: alpha('#ef4444', 0.5),
                        }
                      }}
                    >
                      {slot.time}
                      {!slot.available && (
                        <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                          Booked
                        </Typography>
                      )}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
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
            disabled={!date || !time} 
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

export default StepDateTime;