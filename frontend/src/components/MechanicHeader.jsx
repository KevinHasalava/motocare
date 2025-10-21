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
  Build as RepairIcon,
  Assignment as TaskIcon,
  Timeline as ProgressIcon,
  Person as ProfileIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Logo from "./Landing_Page/Logo";

const MechanicHeader = () => {
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
              background: "linear-gradient(90deg, #10b981, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
            onClick={() => navigate("/mechanic-portal")}
          >
            Mechanic Portal
          </Typography>
        </Stack>

        {/* Center: Mechanic Navigation (desktop only) */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button 
            startIcon={<HomeIcon />} 
            onClick={() => navigate("/mechanic-portal")} 
            sx={navButtonStyle}
          >
            Dashboard
          </Button>
        </Stack>

        {/* Right: Profile Chip + Logout */}
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
                cursor: "pointer",
                "&:hover": {
                  background: "rgba(16, 185, 129, 0.2)",
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

export default MechanicHeader;