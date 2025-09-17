import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, TextField, MenuItem, Button, Alert, Box
} from "@mui/material";

const BookingPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mechanic, setMechanic] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user")); // user object from login

  // Load vehicles of that user
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/bookings/vehicles/${user._id}`)
        .then((res) => setVehicles(res.data))
        .catch(() => setError("Failed to load vehicles"));
    }
  }, [user]);

  // Load all services
  useEffect(() => {
    axios.get("http://localhost:5000/api/services")
      .then((res) => setServices(res.data))
      .catch(() => setError("Failed to load services"));
  }, []);

  // Load mechanics list
  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then((res) => {
        const filtered = res.data.filter(u => u.userType === "mechanic");
        setMechanics(filtered);
      })
      .catch(() => setError("Failed to load mechanics"));
  }, []);

  // Handle booking submit
  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Please log in first");
      return;
    }

    try {
      // combine into slot string
      // const timeSlot = `${date} ${time}`;

      await axios.post("http://localhost:5000/api/bookings", {
        user: user._id,
        vehicle,
        service,
        date,
        time,
        mechanic: mechanic || null
      });

      setSuccess("✅ Booking created successfully!");
      // reset
      setVehicle(""); setService(""); setDate(""); setTime(""); setMechanic("");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  return (
 
    
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Typography variant="h4" gutterBottom align="center">Book a Service</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleBooking}>
        {/* Vehicles Dropdown */}
        <TextField select fullWidth margin="normal" label="Select Vehicle"
          value={vehicle} onChange={(e) => setVehicle(e.target.value)} required>
          {vehicles.map((v) => (
            <MenuItem key={v._id} value={v._id}>
              {v.vehicleNumber} - {v.brand}
            </MenuItem>
          ))}
        </TextField>

        {/* Services Dropdown */}
        <TextField select fullWidth margin="normal" label="Select Service"
          value={service} onChange={(e) => setService(e.target.value)} required>
          {services.map((s) => (
            <MenuItem key={s._id} value={s._id}>
              {s.name} ({s.price} Rs)
            </MenuItem>
          ))}
        </TextField>

        {/* Date */}
        <TextField
          type="date"
          fullWidth
          margin="normal"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {/* Time */}
        <TextField
          type="time"
          fullWidth
          margin="normal"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        {/* Mechanic Dropdown optional */}
        <TextField select fullWidth margin="normal" label="Assign Mechanic (optional)"
          value={mechanic} onChange={(e) => setMechanic(e.target.value)}>
          <MenuItem value="">No mechanic (auto assigned)</MenuItem>
          {mechanics.map((m) => (
            <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
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