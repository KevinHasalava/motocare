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

  // Reusable nav button style (Light Premium Automotive Theme)
  const navButtonStyle = {
    mx: 0.5,
    px: 2,
    py: 1,
    borderRadius: 2,
    color: "#374151",
    fontSize: "0.95rem",
    fontWeight: 600,
    fontFamily: '"Outfit", sans-serif',
    position: "relative",
    overflow: "hidden",
    transition: "all 0.25s ease",
    "&:hover": {
      color: "#D32F2F",
      background: "rgba(211, 47, 47, 0.04)",
      transform: "translateY(-1px)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 0,
      height: "2px",
      background: "#D32F2F",
      transition: "width 0.25s ease",
    },
    "&:hover::before": {
      width: "80%",
    },
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
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
              fontWeight: 800,
              fontFamily: '"Outfit", sans-serif',
              color: "#111827",
              letterSpacing: "-0.01em",
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
                    background: "#D32F2F",
                    color: "white !important",
                    fontWeight: 700,
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={user.name}
              onClick={() => navigate("/profile")} 
              sx={{
                background: "#FEE2E2",
                border: "1px solid #FECACA",
                color: "#B91C1C",
                fontWeight: 600,
                px: 1,
                cursor: "pointer",
                "&:hover": {
                  background: "#FCD34D30",
                },
                "& .MuiChip-avatar": {
                  color: "white",
                },
              }}
            />
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#D32F2F",
                background: "rgba(211, 47, 47, 0.08)",
                border: "1px solid rgba(211, 47, 47, 0.2)",
                "&:hover": {
                  background: "rgba(211, 47, 47, 0.16)",
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
              borderColor: "#D32F2F",
              color: "#D32F2F",
              fontWeight: 600,
              background: "rgba(211, 47, 47, 0.05)",
              "&:hover": {
                borderColor: "#B71C1C",
                background: "#D32F2F",
                color: "white",
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