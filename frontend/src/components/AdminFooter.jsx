import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";

const AdminFooter = () => (
  <Box
    component="footer"
    sx={{
      py: 2,
      px: 2,
      mt: "auto",
      textAlign: "center",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      background: "#0f172a", // dark navy for consistency
      color: "#9ca3af",      // gray-400
    }}
  >
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
    >
      {/* Left side: Copyright */}
      <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
        © {new Date().getFullYear()} Moto‑Care Admin Panel
      </Typography>

      {/* Right side: Version + Status */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography
          variant="body2"
          sx={{ fontSize: "0.8rem", color: "#a5b4fc", fontWeight: 500 }}
        >
          v1.0.0
        </Typography>
        <Chip
          label="All systems operational"
          size="small"
          sx={{
            bgcolor: "rgba(16,185,129,0.15)", // soft green background
            color: "#10b981",                 // green text
            fontSize: "0.7rem",
            height: 22,
          }}
        />
      </Stack>
    </Stack>
  </Box>
);

export default AdminFooter;