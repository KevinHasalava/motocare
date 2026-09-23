import React, { useState } from "react";
import { Box, Container, Paper, Typography, TextField, Button, Alert, InputAdornment } from "@mui/material";
import { Lock as LockIcon, ArrowBack as BackIcon } from "@mui/icons-material";
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
    <Box sx={{ minHeight: '100vh', background: '#F8F9FB', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: '20px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute', top: 0, left: 0, right: 0,
              height: '3px',
              background: '#D32F2F',
            }
          }}
        >
          {/* Icon */}
          <Box sx={{
            width: 60, height: 60, borderRadius: '16px',
            background: '#FFEBEE', border: '1px solid rgba(211,47,47,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mb: 3,
          }}>
            <LockIcon sx={{ color: '#D32F2F', fontSize: 28 }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', fontFamily: '"Outfit", sans-serif', mb: 0.75 }}>
            Reset Password
          </Typography>
          <Typography sx={{ color: '#6B7280', fontSize: '0.95rem', mb: 3, lineHeight: 1.65 }}>
            Enter your new password below to regain access to your account.
          </Typography>

          {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>{msg}</Alert>}
          {err && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{err}</Alert>}

          <form onSubmit={submit}>
            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px', background: '#F9FAFB',
                  '& fieldset': { borderColor: '#E5E7EB' },
                  '&:hover fieldset': { borderColor: '#D1D5DB' },
                  '&.Mui-focused fieldset': { borderColor: '#D32F2F', borderWidth: 2 },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D32F2F' },
              }}
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px', background: '#F9FAFB',
                  '& fieldset': { borderColor: '#E5E7EB' },
                  '&:hover fieldset': { borderColor: '#D1D5DB' },
                  '&.Mui-focused fieldset': { borderColor: '#D32F2F', borderWidth: 2 },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D32F2F' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                py: 1.6, borderRadius: '10px',
                background: '#D32F2F',
                fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 4px 16px rgba(211,47,47,0.28)',
                '&:hover': { background: '#B71C1C', transform: 'translateY(-2px)' },
              }}
            >
              Reset Password
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Box
              component="a" href="/login"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#D32F2F' } }}
            >
              <BackIcon sx={{ fontSize: 16 }} /> Back to Login
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;