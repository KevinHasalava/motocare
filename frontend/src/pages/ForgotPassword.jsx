import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Alert } from "@mui/material";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [link, setLink] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg(""); setErr(""); setLink("");
    try {
      const { data } = await axios.post("http://localhost:5000/api/users/forgot-password", { email });
      setMsg(data.message || "If an account exists, a reset link has been sent.");
      if (data.resetLink) setLink(data.resetLink);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={800} gutterBottom>Forgot Password</Typography>
        {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
        {link && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Dev: Reset link — <a href={link}>{link}</a>
          </Alert>
        )}
        <form onSubmit={submit}>
          <TextField fullWidth label="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required margin="normal" />
          <Button type="submit" variant="contained">Send Reset Link</Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;