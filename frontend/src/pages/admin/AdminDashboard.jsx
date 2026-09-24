import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Container,
  Stack,
  ThemeProvider,
  createTheme
} from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  People,
  BookOnline,
  Payment,
  Inventory,
  Assignment,
  Build,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import AdminFooter from "../../components/AdminFooter";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Light theme for this page
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#F8F9FB', paper: '#FFFFFF' },
  },
});

// Default fallback stats
const mockAdminStats = {
  users: 0,
  bookings: 0,
  payments: 0,
  vehicles: 0,
  services: 0,
  tasks: 0,
  inventory: 0,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockAdminStats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { "x-auth-token": token },
        });

        if (response.data.success && response.data.data) {
          setStats(response.data.data);
        } else {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error.response?.data || error.message);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Chart setup
  const chartData = {
    labels: ["Users", "Bookings", "Vehicles", "Services", "Tasks", "Payments", "Inventory"],
    datasets: [
      {
        label: "Count",
        data: [
          stats.users,
          stats.bookings,
          stats.vehicles,
          stats.services,
          stats.tasks,
          stats.payments,
          stats.inventory,
        ],
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: context, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = context.createLinearGradient(
            0, chartArea.bottom, 0, chartArea.top
          );
          gradient.addColorStop(0, "rgba(211,47,47,0.7)");
          gradient.addColorStop(1, "rgba(183,28,28,0.9)");
          return gradient;
        },
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(211,47,47,0.3)",
        hoverBackgroundColor: "rgba(211,47,47,0.95)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#374151", font: { weight: "bold", size: 14 } } },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.97)",
        titleColor: "#111827",
        bodyColor: "#6B7280",
        borderColor: '#E5E7EB',
        borderWidth: 1,
      },
    },
    scales: {
      x: { ticks: { color: "#6B7280" }, grid: { color: "rgba(0,0,0,0.05)" } },
      y: { ticks: { color: "#6B7280" }, grid: { color: "rgba(0,0,0,0.05)" } },
    },
  };

  const StatCard = ({ title, value, description, icon, color, path }) => (
    <Card
      sx={{
        minHeight: 160,
        p: 3,
        borderRadius: '16px',
        background: '#FFFFFF',
        border: `1px solid ${color}30`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        cursor: path ? "pointer" : "default",
        transition: "all 0.3s ease",
        "&:hover": path
          ? { transform: "translateY(-5px)", boxShadow: `0 12px 32px ${color}25` }
          : {},
      }}
      onClick={() => path && navigate(path)}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "14px",
            background: `${color}15`,
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
            fontSize: 32,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#374151" }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#111827", fontFamily: '"Outfit", sans-serif' }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
            {description}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8F9FB" }}>
        <AdminHeader />

        <Box component="main" sx={{ flexGrow: 1, pt: 12, pb: 4 }}>
          <Container maxWidth="xl">
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{
                fontWeight: 900,
                mb: 4,
                color: '#111827',
                fontFamily: '"Outfit", sans-serif',
              }}
            >
              Admin Dashboard
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Users"
                  value={stats.users}
                  description="Manage accounts"
                  icon={<People />}
                  color="#6366f1"
                  path="/admin-users"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Bookings"
                  value={stats.bookings}
                  description="Service bookings"
                  icon={<BookOnline />}
                  color="#D32F2F"
                  path="/admin/bookings"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Vehicles"
                  value={stats.vehicles}
                  description="Registered vehicles"
                  icon={<Build />}
                  color="#f59e0b"
                  path="/admin/vehicles"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Services"
                  value={stats.services}
                  description="Service packages"
                  icon={<Inventory />}
                  color="#10b981"
                  path="/admin-service"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Tasks"
                  value={stats.tasks}
                  description="Workshop jobs"
                  icon={<Assignment />}
                  color="#8b5cf6"
                  path="/admin/tasks"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Payments"
                  value={stats.payments}
                  description="Customer payments"
                  icon={<Payment />}
                  color="#06b6d4"
                  path="/admin/payments"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
              <StatCard
                 title="Inventory"
                 value={stats.inventory}
                 description="Spare parts stock"
                 icon={<Inventory />}
                 color="#14b8a6"
                 path="/inventory"
              />
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 4,
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    height: 500,
                    display: "flex",
                    flexDirection: "column",
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, color: '#111827', fontWeight: 800, textAlign: "center", fontFamily: '"Outfit", sans-serif' }}
                  >
                    📊 Service Center Stats Overview
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Bar data={chartData} options={chartOptions} />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
        <AdminFooter />
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;