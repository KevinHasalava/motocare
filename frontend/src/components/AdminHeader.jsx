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
  People,
  BookOnline,
  Assignment,
  Inventory,
  Payment,
  Build,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Logo from "./Landing_Page/Logo"; // ✅ Logo import

const AdminHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // ✅ Load user on mount
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Reusable nav button style (same hover effect as public header)
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
        
        {/* ✅ Left: Logo + Title */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            <Logo size="medium" variant="default" clickable />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #6366f1, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
            onClick={() => navigate("/admin-dashboard")}
          >
            Admin Dashboard
          </Typography>
        </Stack>

        {/* ✅ Center: Nav (desktop only) */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button startIcon={<People />} onClick={() => navigate("/admin-users")} sx={navButtonStyle}>
            Users
          </Button>
          <Button startIcon={<BookOnline />} onClick={() => navigate("/admin/bookings")} sx={navButtonStyle}>
            Bookings
          </Button>
          <Button startIcon={<Build />} onClick={() => navigate("/admin/vehicles")} sx={navButtonStyle}>
            Vehicles
          </Button>
          <Button startIcon={<Inventory />} onClick={() => navigate("/admin/services")} sx={navButtonStyle}>
            Services
          </Button>
          <Button startIcon={<Assignment />} onClick={() => navigate("/inventory")} sx={navButtonStyle}>
            Inventory
          </Button>
          <Button startIcon={<Payment />} onClick={() => navigate("/admin/payments")} sx={navButtonStyle}>
            Payments
          </Button>
        </Stack>

        {/* ✅ Right: Profile Chip + Logout */}
        {user ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              avatar={
                <Avatar
                  sx={{
                    background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                    color: "white !important",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={user.name}
              onClick={() => navigate("/profile")} 
              sx={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "white",
                fontWeight: 600,
                px: 1,
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

        {/* ✅ Mobile Hamburger */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" }, ml: 1, color: "white" }}
          onClick={() => navigate("/admin-menu")}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;