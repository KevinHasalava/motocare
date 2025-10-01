import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");
    if (!token) return setErr("Invalid or missing token");
    if (pwd.length < 6) return setErr("Password must be at least 6 characters");
    if (pwd !== confirm) return setErr("Passwords do not match");
    try {
      await axios.post("http://localhost:5000/api/users/reset-password", { token, newPassword: pwd });
      setMsg("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e) {
      setErr(e.response?.data?.message || "Reset failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={800} gutterBottom>Reset Password</Typography>
        {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
        <form onSubmit={submit}>
          <TextField fullWidth type="password" label="New Password" value={pwd}
            onChange={(e) => setPwd(e.target.value)} margin="normal" required />
          <TextField fullWidth type="password" label="Confirm New Password" value={confirm}
            onChange={(e) => setConfirm(e.target.value)} margin="normal" required />
          <Button type="submit" variant="contained">Reset Password</Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPassword;