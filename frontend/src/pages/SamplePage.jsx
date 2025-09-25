import React from "react";
import {
  Box,
  Container,
  Typography,
  CssBaseline,
  GlobalStyles
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// 👉 Import your theme, header, footer and utils
import { theme, backgroundKeyframes, mockData } from "../utils/theme";
import Header from "../components/Header";
import Footer from "../components/Footer";
import handleBookServiceClick from "../pages/VehiclePage"; // if needed, can modify

const SamplePage = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <GlobalStyles styles={backgroundKeyframes} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            position: "relative",
            overflowX: "hidden",
          }}
        >
          {/* 🟢 Header (always at top) */}
          <Header
            navItems={mockData.navItems}
            onBookNowClick={handleBookServiceClick}
            theme={theme}
          />

          {/* 🟣 Page Content (replace this section as needed) */}
          <Box component="main" sx={{ flexGrow: 1, pt: "80px", pb: 8 }}>
            <Container maxWidth="md" sx={{ mt: 10 }}>
              <Typography
                variant="h3"
                gutterBottom
                align="center"
                sx={{ fontWeight: "bold" }}
              >
                Sample Page
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary">
                👋 This is a sample page content area.  
                Replace this text with your actual page design.
              </Typography>
            </Container>
          </Box>

          {/* 🔵 Footer (always at bottom) */}
          <Footer />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default SamplePage;