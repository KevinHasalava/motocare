// src/pages/BookingPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container, Typography, TextField, Button, MenuItem, Box, Alert
} from "@mui/material";
import axios from "axios";

const BookingPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);

  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user")); // logged user

  // ⚡ Load user vehicles
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/bookings/vehicles/${user._id}`)
        .then(res => setVehicles(res.data))
        .catch(() => setError("Failed to load vehicles"));
    }
  }, [user]);

  // ⚡ Load services
  useEffect(() => {
    axios.get("http://localhost:5000/api/services")
      .then(res => setServices(res.data))
      .catch(() => setError("Failed to load services"));
  }, []);

  // ⚡ Load available time slots when date selected
  useEffect(() => {
    if (date) {
      axios.get(`http://localhost:5000/api/bookings/available?date=${date}`)
        .then(res => setSlots(res.data.available))
        .catch(() => setError("Failed to load slots"));
    }
  }, [date]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("You must log in first");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/bookings", {
        user: user._id,
        vehicle,
        service,
        date,
        timeSlot
      });

      if (res.data.booking) {
        setSuccess("✅ Booking created successfully!");
        setVehicle("");
        setService("");
        setDate("");
        setTimeSlot("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Typography variant="h4" gutterBottom align="center">
        Book a Service
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleBooking}>
        
        {/* Vehicle Dropdown */}
        <TextField
          select
          fullWidth margin="normal"
          label="Select Vehicle"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          required
        >
          {vehicles.map((v) => (
            <MenuItem key={v._id} value={v._id}>
              {v.vehicleNumber} - {v.brand} {v.model}
            </MenuItem>
          ))}
        </TextField>

        {/* Service Dropdown */}
        <TextField
          select
          fullWidth margin="normal"
          label="Select Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
        >
          {services.map((s) => (
            <MenuItem key={s._id} value={s._id}>
              {s.name} ({s.duration}min / Rs.{s.price})
            </MenuItem>
          ))}
        </TextField>

        {/* Date Picker */}
        <TextField
          type="date"
          fullWidth margin="normal"
          label="Select Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* Available Slots Dropdown */}
        <TextField
          select
          fullWidth margin="normal"
          label="Select Time Slot"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          required
          disabled={!date}
        >
          {slots.map((slot, index) => (
            <MenuItem key={index} value={slot}>{slot}</MenuItem>
          ))}
        </TextField>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Confirm Booking
        </Button>
      </Box>
    </Container>
  );
};

export default BookingPage;