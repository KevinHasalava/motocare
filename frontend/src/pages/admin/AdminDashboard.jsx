// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Container,
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
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// ChartJS setup
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getUserCount", {
          withCredentials: true,
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: userCount.getUserCount,
    bookings: 0,
    payments: 0,
    inventory: 0,
    tasks: 0,
    vehicles: 0,
    services: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/stats", {
          withCredentials: true,
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Chart data
  const chartData = {
    labels: ["Users", "Bookings", "Vehicles", "Services", "Tasks", "Payments"],
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
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Service Center Overview" },
    },
  };

  // StatCard Component
  const StatCard = ({ title, value, description, icon, path }) => (
    <Card
      sx={{
        minHeight: 150,
        boxShadow: 3,
        borderRadius: 3,
        cursor: path ? "pointer" : "default",
        "&:hover": path ? { boxShadow: 6, transform: "scale(1.02)" } : {},
        transition: "0.2s",
      }}
      onClick={() => path && navigate(path)}
    >
      <CardHeader avatar={icon} title={<Typography variant="h6">{title}</Typography>} />
      <CardContent>
        <Typography variant="h5" color="primary">
          {value}
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <Header 
      navItems={['Features', 'Process', 'About', 'Contact']}
       
       />

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, pt: 10, pb: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom align="center">
            🚗 Admin Dashboard
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Users"
                value={stats.users}
                description="Manage all user accounts"
                icon={<People color="primary" />}
                path="/admin-users"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Bookings"
                value={stats.bookings}
                description="Customer service bookings"
                icon={<BookOnline color="error" />}
                path="/admin/bookings"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Vehicles"
                value={stats.vehicles}
                description="Registered customer vehicles"
                icon={<Build color="warning" />}
                path="/admin/vehicles"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Services"
                value={stats.services}
                description="Available service packages"
                icon={<Inventory color="success" />}
                path="/admin/services"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Tasks"
                value={stats.tasks}
                description="Assigned workshop jobs"
                icon={<Assignment color="secondary" />}
                path="/admin/tasks"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Payments"
                value={stats.payments}
                description="Completed customer payments"
                icon={<Payment color="info" />}
                path="/admin/payments"
              />
            </Grid>

            {/* Chart */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
                <CardHeader title="📊 Overview Chart" />
                <CardContent>
                  <Bar data={chartData} options={chartOptions} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default AdminDashboard;
