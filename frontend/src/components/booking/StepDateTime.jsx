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
            <Paper sx={{ p: 2, background: "#1e293b" }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <CalendarMonthIcon sx={{ color: "white" }} />
                <Typography sx={{ color: "white" }}>Select Date</Typography>
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
                  "& .MuiPickersDay-root": { color: "white" },
                  "& .Mui-disabled": { color: "#666 !important" }
                }}
              />
            </Paper>
          </Grid>

          {/* Mechanic Selection */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, background: "#1e293b", maxHeight: 500, overflow: "auto" }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <EngineeringIcon sx={{ color: "white" }} />
                <Typography sx={{ color: "white" }}>Select Mechanic (Optional)</Typography>
              </Stack>
              
              <Card
                onClick={() => { 
                  setMechanic(null); 
                  setTime(null); 
                }}
                sx={{
                  cursor: "pointer", mb: 2,
                  border: !mechanic ? "2px solid #10b981" : "1px solid #555",
                  backgroundColor: !mechanic ? alpha("#10b981", 0.1) : "transparent"
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography>Any Available Mechanic</Typography>
                    {!mechanic && <CheckCircleIcon color="success"/>}
                  </Stack>
                </CardContent>
              </Card>

              <Stack spacing={2}>
                {mechanics.map((mech) => (
                  <Card 
                    key={mech._id}
                    onClick={() => { 
                      setMechanic(mech); 
                      setTime(null); 
                    }}
                    sx={{
                      cursor: "pointer",
                      border: mechanic?._id === mech._id ? "2px solid #10b981" : "1px solid #555",
                      backgroundColor: mechanic?._id === mech._id ? alpha("#10b981", 0.1) : "transparent"
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "#667eea" }}>{mech.name?.charAt(0)}</Avatar>
                        <Typography>{mech.name}</Typography>
                        {mechanic?._id === mech._id && <CheckCircleIcon color="success"/>}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Time slots */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, background: "#1e293b", maxHeight: 500, overflow: "auto" }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <AccessTimeIcon sx={{ color: "white" }} />
                <Typography sx={{ color: "white" }}>
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
                            borderColor: !date ? "#64748b" : available ? "#10b981" : "#ef4444",
                            color: isSelected ? "white" : (available ? "#10b981" : "#ef4444"),
                            backgroundColor: isSelected && available ? "#10b981" : "transparent",
                            "&:hover": {
                                backgroundColor: available && !isSelected ? alpha("#10b981", 0.1) : undefined
                            },
                            "&.Mui-disabled": {
                                borderColor: !date ? "#64748b" : "#ef4444",
                                color: !date ? "#64748b" : "#ef4444"
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
          <Button onClick={onBack} variant="outlined" size="large">Back</Button>
          <Button 
            disabled={!canProceed} 
            variant="contained" 
            onClick={onNext}
            size="large"
            sx={{
              backgroundColor: "#10b981",
              "&:hover": { backgroundColor: "#0d9668" }
            }}
          >Next</Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default StepDateTime;