import React, { useMemo, useCallback } from "react";
import {
  Box, Button, Grid, Paper, Stack, Typography, Fade, alpha,
  Card, CardContent, Avatar
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EngineeringIcon from "@mui/icons-material/Engineering";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
    }
  }
  slots.push("17:00");
  return slots;
};

const ALL_TIME_SLOTS = generateTimeSlots();

const StepDateTime = ({
  date,
  setDate,
  time,
  setTime,
  mechanic,
  setMechanic,
  mechanics,
  bookings, // Now this prop receives JOBS data
  serviceDuration = 30,
  onNext,
  onBack,
}) => {

  const doTimesOverlap = useCallback((start1, end1, start2, end2) => {
    return start1.isBefore(end2) && end1.isAfter(start2);
  }, []);

  const slotAvailability = useMemo(() => {

    const now = dayjs();
    const isToday = date.isSame(now, 'day');
    
    if (!date) return {};

    // We can now directly use the `bookings` prop as it contains JOBS with `startTime`
    const dateBookings = (bookings || []).filter(
      (job) => job.startTime && dayjs(job.startTime).isSame(date, 'day') && job.status !== "Cancelled"
    );

    const availability = {};

    for (const slot of ALL_TIME_SLOTS) {
      const selectedDateStr = date.format("YYYY-MM-DD");
      const slotStartTime = dayjs(`${selectedDateStr} ${slot}`);
      const slotEndTime = slotStartTime.add(serviceDuration, "minute");

    if (isToday && slotStartTime.isBefore(now)) {
    availability[slot] = false;
    continue; // <-- ප්‍රධාන සාධකය මෙයයි!
    }
      
      let isSlotAvailable = false;

      if (mechanic) {
        const mechanicJobs = dateBookings.filter(j => j.mechanic?._id === mechanic._id);
        const hasConflict = mechanicJobs.some(job => {
            const bookingStart = dayjs(job.startTime);
            const bookingEnd = dayjs(job.endTime);
            return doTimesOverlap(slotStartTime, slotEndTime, bookingStart, bookingEnd);
        });
        isSlotAvailable = !hasConflict;
      } else {
        const availableMechanicsForSlot = mechanics.filter(m => {
          const mechanicJobs = dateBookings.filter(j => j.mechanic?._id === m._id);
          const hasConflictForThisMechanic = mechanicJobs.some(job => {
              const bookingStart = dayjs(job.startTime);
              const bookingEnd = dayjs(job.endTime);
              return doTimesOverlap(slotStartTime, slotEndTime, bookingStart, bookingEnd);
            });
          return !hasConflictForThisMechanic;
        });
        isSlotAvailable = availableMechanicsForSlot.length > 0;
      }
      
      availability[slot] = isSlotAvailable;
    }
    return availability;

  }, [date, mechanic, bookings, mechanics, serviceDuration, doTimesOverlap]);

  const canProceed = date && time && slotAvailability[time.format("HH:mm")];
  
  // --- JSX (NO CHANGES HERE) ---
  return (
    <Fade in timeout={600}>
      <Box>
         {/* ... Your entire UI part of the component goes here ... */}
        <Grid container spacing={3}>
          {/* Date Selection */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2.5, background: "#FFFFFF", borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <CalendarMonthIcon sx={{ color: "#D32F2F" }} />
                <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "1rem" }}>Select Date</Typography>
              </Stack>
              <DateCalendar
                value={date}
                onChange={(newDate) => { 
                  setDate(newDate); 
                  setTime(null); 
                  setMechanic(null); 
                }}
                disablePast
                sx={{
                  width: '100%',
                  "& .MuiPickersDay-root": { 
                    color: "#0F172A",
                    fontWeight: 600,
                    "&.Mui-selected": {
                      backgroundColor: "#D32F2F !important",
                      color: "#FFFFFF !important",
                    },
                    "&:hover": {
                      backgroundColor: "#FEE2E2",
                    }
                  },
                  "& .Mui-disabled": { color: "#CBD5E1 !important" }
                }}
              />
            </Paper>
          </Grid>

          {/* Mechanic Selection */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2.5, background: "#FFFFFF", borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", maxHeight: 520, overflow: "auto" }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <EngineeringIcon sx={{ color: "#D32F2F" }} />
                <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "1rem" }}>Select Mechanic (Optional)</Typography>
              </Stack>
              
              <Card
                onClick={() => { 
                  setMechanic(null); 
                  setTime(null); 
                }}
                sx={{
                  cursor: "pointer", mb: 2,
                  border: !mechanic ? "2px solid #D32F2F" : "1px solid #E2E8F0",
                  backgroundColor: !mechanic ? "#FEF2F2" : "#FFFFFF",
                  boxShadow: !mechanic ? "0 4px 12px rgba(211, 47, 47, 0.1)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.95rem" }}>Any Available Mechanic</Typography>
                    {!mechanic && <CheckCircleIcon sx={{ color: "#D32F2F" }} />}
                  </Stack>
                </CardContent>
              </Card>

              <Stack spacing={1.5}>
                {mechanics.map((mech) => (
                  <Card 
                    key={mech._id}
                    onClick={() => { 
                       setMechanic(mech); 
                      setTime(null); 
                    }}
                    sx={{
                      cursor: "pointer",
                      border: mechanic?._id === mech._id ? "2px solid #D32F2F" : "1px solid #E2E8F0",
                      backgroundColor: mechanic?._id === mech._id ? "#FEF2F2" : "#FFFFFF",
                      boxShadow: mechanic?._id === mech._id ? "0 4px 12px rgba(211, 47, 47, 0.1)" : "none",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "#D32F2F", width: 36, height: 36, fontSize: "0.95rem", fontWeight: 700 }}>{mech.name?.charAt(0)}</Avatar>
                        <Typography sx={{ fontWeight: 600, color: "#0F172A", flexGrow: 1 }}>{mech.name}</Typography>
                        {mechanic?._id === mech._id && <CheckCircleIcon sx={{ color: "#D32F2F" }} />}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Time slots */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2.5, background: "#FFFFFF", borderRadius: 3, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", maxHeight: 520, overflow: "auto" }}>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <AccessTimeIcon sx={{ color: "#D32F2F" }} />
                <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "1rem" }}>
                  Select Time {!date && " (Select date first)"}
                </Typography>
              </Stack>
              
              <Grid container spacing={1}>
                {ALL_TIME_SLOTS.map((slot) => {
                  const available = !!slotAvailability[slot];
                  const isSelected = time?.format("HH:mm") === slot;
                  return (
                    <Grid item xs={6} key={slot}>
                      <Button
                        fullWidth
                        variant={isSelected ? "contained" : "outlined"}
                        disabled={!date || !available}
                        onClick={() => setTime(dayjs(`${date.format("YYYY-MM-DD")} ${slot}`))}
                        sx={{
                            fontWeight: 600,
                            borderRadius: 2,
                            borderColor: !date ? "#E2E8F0" : isSelected ? "#D32F2F" : available ? "#CBD5E1" : "#FEE2E2",
                            color: isSelected ? "#FFFFFF" : available ? "#0F172A" : "#FDA4AF",
                            backgroundColor: isSelected ? "#D32F2F" : available ? "#FFFFFF" : "#FFF1F2",
                            "&:hover": {
                                backgroundColor: isSelected ? "#B71C1C" : available ? "#FEF2F2" : undefined,
                                borderColor: isSelected ? "#B71C1C" : available ? "#D32F2F" : undefined,
                            },
                            "&.Mui-disabled": {
                                borderColor: "#F1F5F9",
                                color: "#94A3B8",
                                backgroundColor: "#F8FAFC"
                            }
                        }}
                      >
                        {slot}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Navigation */}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button onClick={onBack} variant="outlined" size="large" sx={{ px: 4, py: 1.5, borderColor: '#CBD5E1', color: '#334155', fontWeight: 600, '&:hover': { borderColor: '#94A3B8', background: '#F1F5F9' } }}>Back</Button>
          <Button 
            disabled={!canProceed} 
            variant="contained" 
            onClick={onNext}
            size="large"
            sx={{
              backgroundColor: "#D32F2F",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 14px rgba(211, 47, 47, 0.3)',
              "&:hover": { backgroundColor: "#B71C1C" },
              "&.Mui-disabled": { backgroundColor: "#E2E8F0", color: "#94A3B8" }
            }}
          >Next</Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default StepDateTime;