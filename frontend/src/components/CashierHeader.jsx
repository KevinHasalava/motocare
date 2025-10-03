import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Stack,
  Avatar,
  Chip,
  Box,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Receipt as InvoiceIcon,
  History as HistoryIcon,
  Person as ProfileIcon,
  Home as HomeIcon,
  Build as BuildIcon,
  AddTask as AddTaskIcon,
  Settings as SettingsIcon,
  Engineering as EngineeringIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Logo from "./Landing_Page/Logo";

const CashierHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user on mount
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Reusable nav button style
  const navButtonStyle = {
    mx: 0.5,
    px: 2.5,
    py: 1,
    borderRadius: 2,
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.95rem",
    fontWeight: 600,
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      color: "white",
      background: "rgba(99, 102, 241, 0.1)",
      transform: "translateY(-2px)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 0,
      height: "2px",
      background: "linear-gradient(90deg, #6366f1, #a855f7)",
      transition: "width 0.3s ease",
    },
    "&:hover::before": {
      width: "80%",
    },
  };

  const getWelcomeMessage = () => {
    const userType = user?.userType || 'user';
    const name = user?.name || 'User';
    
    switch (userType) {
      case 'admin':
        return `Admin Panel - Welcome, ${name}`;
      case 'mechanic':
        return `Mechanic Portal - Welcome, ${name}`;
      case 'cashier':
        return `Cashier Portal - Welcome, ${name}`;
      default:
        return `Dashboard - Welcome, ${name}`;
    }
  };

  const getNavigationItems = () => {
    const userType = user?.userType;
    
    switch (userType) {
      case 'admin':
        return [
          { label: 'Admin Dashboard', path: '/admin-dashboard', icon: <DashboardIcon /> },
          { label: 'Manage Services', path: '/admin-service', icon: <SettingsIcon /> },
          { label: 'Create Walk-in Job', path: '/admin/walkinjob', icon: <BuildIcon /> }
        ];
      case 'mechanic':
        return [
          { label: 'My Jobs', path: '/mechanic-portal', icon: <EngineeringIcon /> }
        ];
      case 'cashier':
        return [
          { label: 'Dashboard', path: '/cashier-dashboard', icon: <DashboardIcon /> },
          { label: 'Process Payments', path: '/cashier', icon: <PaymentIcon /> },
          { label: 'Payment History', path: '/payment-history', icon: <ReceiptIcon /> },
          { label: 'Create Walk-in Job', path: '/admin/walkinjob', icon: <BuildIcon /> }
        ];
      default:
        return [];
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 70 }}>
        
        {/* Left: Logo + Title */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <Logo size="medium" variant="default" clickable />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #f59e0b, #ef4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
            onClick={() => navigate("/cashier-dashboard")}
          >
            Cashier Portal
          </Typography>
        </Stack>

        {/* Center: Cashier Navigation (desktop only) */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button 
            startIcon={<DashboardIcon />} 
            onClick={() => navigate("/cashier-dashboard")} 
            sx={navButtonStyle}
          >
            Dashboard
          </Button>
          <Button 
            startIcon={<PaymentIcon />} 
            onClick={() => navigate("/cashier")} 
            sx={navButtonStyle}
          >
            Process Payments
          </Button>
          <Button 
            startIcon={<HistoryIcon />} 
            onClick={() => navigate("/payment-history")} 
            sx={navButtonStyle}
          >
            Payment History
          </Button>
          <Button 
            startIcon={<AddTaskIcon />} 
            onClick={() => navigate("/admin/walkinjob")} 
            sx={navButtonStyle}
          >
            Create Walk-in Job
          </Button>
          <Button 
            startIcon={<AddTaskIcon />} 
            onClick={() => navigate("/admin/jobs")} 
            sx={navButtonStyle}
          >
            Jobs
          </Button>
        </Stack>

        {/* Right: Profile Chip + Logout */}
        {user ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              avatar={
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                    color: "white !important",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={user.name}
              onClick={() => navigate("/cashier/profile")} 
              sx={{
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "white",
                fontWeight: 600,
                px: 1,
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(245, 158, 11, 0.2)",
                },
                "& .MuiChip-avatar": {
                  color: "white",
                },
              }}
            />
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#ef4444",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                "&:hover": {
                  background: "rgba(239, 68, 68, 0.2)",
                  transform: "rotate(180deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Stack>
        ) : (
          <Button
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              ml: 3,
              px: 3,
              py: 1,
              borderRadius: 2,
              borderColor: "rgba(99, 102, 241, 0.5)",
              color: "#6366f1",
              fontWeight: 600,
              background: "rgba(99, 102, 241, 0.05)",
              "&:hover": {
                borderColor: "#6366f1",
                background: "rgba(99, 102, 241, 0.1)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CashierHeader;