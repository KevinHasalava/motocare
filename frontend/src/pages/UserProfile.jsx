// frontend/src/pages/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button, Avatar,
  Grid, Stack, Alert, CircularProgress, Divider, Card, CardContent,
  ThemeProvider, CssBaseline, GlobalStyles, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import {
  Edit as EditIcon, Save as SaveIcon,
  Cancel as CancelIcon, Email as EmailIcon, Badge as BadgeIcon,
  Lock as LockIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { theme, backgroundKeyframes, gradientText } from '../utils/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const [bookings, setBookings] = useState([]); // for customers
  const [services, setServices] = useState([]); // for customers
  const [stats, setStats] = useState([]);       // for admin

  const navigate = useNavigate();

  // fetch profile + role data
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!savedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(savedUser);
    setFormData({ name: savedUser.name, email: savedUser.email });

    if (savedUser.userType === "customer") {
      fetchBookings(savedUser._id, token);
      fetchServices(token);
    } else if (savedUser.userType === "admin") {
      fetchStats(token);
    }
    // else if (savedUser.userType === "mechanic") { fetchJobs(...) }
  }, [navigate]);

  const fetchBookings = async (uid, token) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/user/${uid}`, {
        headers: { "x-auth-token": token }
      });
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    }
  };

  const fetchServices = async (token) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/services`, {
        headers: { "x-auth-token": token }
      });
      setServices(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch services");
    }
  };

  const fetchStats = async (token) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/stats/data`, {
        headers: { "x-auth-token": token }
      });
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stats");
    }
  };

  // Handlers
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = e => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  const togglePasswordVisibility = field => setPasswordData({ ...passwordData, [field]: !passwordData[field] });
  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setFormData({ name: user.name, email: user.email });
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) return setError("Fill all fields");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/${user._id}`, formData,
        { headers: { "x-auth-token": token } });
      const updated = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmNewPassword)
      return setError("Fill all fields");
    if (newPassword !== confirmNewPassword)
      return setError("Passwords do not match");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/users/${user._id}/password`,
        { currentPassword, newPassword },
        { headers: { "x-auth-token": token } }
      );
      setSuccess("Password updated successfully!");
      setPasswordData({ currentPassword:'',newPassword:'',confirmNewPassword:'',showCurrentPassword:false,showNewPassword:false,showConfirmPassword:false });
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}><CircularProgress/></Box>;

  return (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalStyles styles={backgroundKeyframes} />

    {/* Background blobs */}
    <Box sx={{ position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:-1 }}>
      <Box sx={{ position:'absolute',top:'10%',left:'10%',width:384,height:384,bgcolor:'primary.main',borderRadius:'50%',filter:'blur(100px)' }} />
      <Box sx={{ position:'absolute',bottom:'10%',right:'10%',width:384,height:384,bgcolor:'secondary.main',borderRadius:'50%',filter:'blur(100px)' }} />
    </Box>

    <Box sx={{display:'flex',flexDirection:'column',minHeight:'100vh'}}>
      <Header navItems={["Features","Process","About","Contact"]} theme={theme} />
      <Box component="main" sx={{flexGrow:1,pt:'80px',pb:8}}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" sx={{mt:4,mb:6,fontWeight:700}}>
            My <Box component="span" sx={gradientText}>Profile</Box>
          </Typography>

          {error && <Alert severity="error" sx={{mb:3}}>{error}</Alert>}
          {success && <Alert severity="success" sx={{mb:3}}>{success}</Alert>}

          <Grid container spacing={4}>
            {/* Profile card */}
            <Grid item xs={12} md={4}>
              <Card sx={{p:3,borderRadius:4,backdropFilter:'blur(10px)',background:'rgba(30,41,59,0.6)'}}>
                <Avatar sx={{ width:90, height:90, mx:'auto', mb:2, fontSize:'2rem', background:`linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`}}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5">{user.name}</Typography>
                <Typography variant="body2">{user.email}</Typography>
                <Divider sx={{my:2}}/>
                <Typography variant="caption">Role: {user.userType}</Typography>
                <Typography variant="caption" display="block">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Card>
            </Grid>

            {/* Right side */}
            <Grid item xs={12} md={8}>
              {/* Profile Info */}
              <Paper sx={{p:4,mb:4}}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h5" sx={gradientText}>Profile Information</Typography>
                  {!editing && <Button onClick={()=>setEditing(true)} startIcon={<EditIcon/>}>Edit</Button>}
                </Stack>
                <TextField fullWidth margin="normal" label="Name" name="name" value={formData.name} disabled={!editing} onChange={handleChange}/>
                <TextField fullWidth margin="normal" label="Email" name="email" value={formData.email} disabled={!editing} onChange={handleChange}/>
                {editing && (
                  <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
                    <Button onClick={handleCancel} startIcon={<CancelIcon/>}>Cancel</Button>
                    <Button onClick={handleSaveProfile} startIcon={<SaveIcon/>} variant="contained">Save</Button>
                  </Stack>
                )}
              </Paper>

              {/* Password Change */}
              <Paper sx={{p:4,mb:4}}>
                <Typography variant="h5" sx={gradientText} mb={2}>Change Password</Typography>
                <TextField fullWidth margin="normal" type="password" name="currentPassword" label="Current Password" value={passwordData.currentPassword} onChange={handlePasswordChange}/>
                <TextField fullWidth margin="normal" type="password" name="newPassword" label="New Password" value={passwordData.newPassword} onChange={handlePasswordChange}/>
                <TextField fullWidth margin="normal" type="password" name="confirmNewPassword" label="Confirm New Password" value={passwordData.confirmNewPassword} onChange={handlePasswordChange}/>
                <Button onClick={handleChangePassword} variant="contained" sx={{mt:2}}>Change Password</Button>
              </Paper>

              {/* Role specific sections */}
              {user.userType === "customer" && (
                <>
                {/* Bookings */}
                <Paper sx={{p:4,mb:4}}>
                  <Typography variant="h5" sx={gradientText} mb={2}>Previous Bookings</Typography>
                  <Table>
                    <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Time</TableCell><TableCell>Vehicle</TableCell><TableCell>Service</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                    <TableBody>
                      {bookings.length>0 ? bookings.map(b=>(
                        <TableRow key={b._id}>
                          <TableCell>{new Date(b.date).toLocaleDateString()}</TableCell>
                          <TableCell>{b.timeSlot}</TableCell>
                          <TableCell>{b.vehicle?.brand} {b.vehicle?.model}</TableCell>
                          <TableCell>{b.service?.name}</TableCell>
                          <TableCell>{b.status}</TableCell>
                        </TableRow>
                      )):<TableRow><TableCell colSpan={5} align="center">No bookings</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </Paper>

                {/* Services */}
                <Paper sx={{p:4}}>
                  <Typography variant="h5" sx={gradientText} mb={2}>Available Services</Typography>
                  <Table>
                    <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Description</TableCell><TableCell>Duration</TableCell><TableCell>Price</TableCell></TableRow></TableHead>
                    <TableBody>
                      {services.length>0 ? services.map(s=>(
                        <TableRow key={s._id}><TableCell>{s.name}</TableCell><TableCell>{s.description || "N/A"}</TableCell><TableCell>{s.duration} min</TableCell><TableCell>${s.price}</TableCell></TableRow>
                      )):<TableRow><TableCell colSpan={4} align="center">No services</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </Paper>
                </>
              )}

              {user.userType === "admin" && (
                <Paper sx={{p:4}}>
                  <Typography variant="h5" sx={gradientText} mb={2}>System Stats</Typography>
                  <Table>
                    <TableHead><TableRow><TableCell>Role</TableCell><TableCell>Count</TableCell></TableRow></TableHead>
                    <TableBody>
                      {stats.data ? stats.labels.map((lbl,i)=><TableRow key={i}><TableCell>{lbl}</TableCell><TableCell>{stats.data[i]}</TableCell></TableRow>)
                        :<TableRow><TableCell colSpan={2} align="center">No stats</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </Paper>
              )}

              {user.userType === "mechanic" && (
                <Paper sx={{p:4}}>
                  <Typography variant="h5" sx={gradientText} mb={2}>Assigned Jobs</Typography>
                  <Typography color="text.secondary">👷 Mechanic jobs will be shown here (teammate implement).</Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer/>
    </Box>
  </ThemeProvider>);
};

export default UserProfile;
