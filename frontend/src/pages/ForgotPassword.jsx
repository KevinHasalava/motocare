import React, { useState } from "react";
import { Box, Container, Paper, Typography, TextField, Button, Alert, InputAdornment } from "@mui/material";
import { Email as EmailIcon, ArrowBack as BackIcon } from "@mui/icons-material";
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
            <EmailIcon sx={{ color: '#D32F2F', fontSize: 28 }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', fontFamily: '"Outfit", sans-serif', mb: 0.75 }}>
            Forgot Password?
          </Typography>
          <Typography sx={{ color: '#6B7280', fontSize: '0.95rem', mb: 3, lineHeight: 1.65 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>{msg}</Alert>}
          {err && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{err}</Alert>}
          {link && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: '10px' }}>
              Dev: Reset link — <a href={link}>{link}</a>
            </Alert>
          )}

          <form onSubmit={submit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  background: '#F9FAFB',
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
              Send Reset Link
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

export default ForgotPassword;