import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Paper,
    Container
} from '@mui/material';
import {
    Payment,
    Receipt,
    Add,
    History,
    TrendingUp,
    Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import HeaderWrapper from '../components/HeaderWrapper';

const CashierContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    paddingTop: theme.spacing(10), // Account for fixed header
}));

const WelcomeSection = styled(Paper)(({ theme }) => ({
    background: '#D32F2F',
    color: 'white',
    padding: theme.spacing(4),
    margin: theme.spacing(3, 0),
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(211,47,47,0.25)',
}));

const ActionCard = styled(Card)(({ theme }) => ({
    height: '200px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    }
}));

const CashierDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const dashboardActions = [
        {
            title: 'Process Payments',
            description: 'Handle customer payments and generate invoices',
            icon: <Payment sx={{ fontSize: 48, color: '#1976d2' }} />,
            path: '/cashier',
            color: '#1976d2'
        },
        {
            title: 'Verify Payment Slips',
            description: 'Review and approve uploaded payment slips',
            icon: <Receipt sx={{ fontSize: 48, color: '#ff9800' }} />,
            path: '/cashier/slip-verification',
            color: '#ff9800'
        },
        {
            title: 'Payment History',
            description: 'View transaction records and invoice history',
            icon: <Receipt sx={{ fontSize: 48, color: '#2e7d32' }} />,
            path: '/payment-history',
            color: '#2e7d32'
        },
        {
            title: 'Create Walk-in Job',
            description: 'Register new customers and create service jobs',
            icon: <Add sx={{ fontSize: 48, color: '#ed6c02' }} />,
            path: '/admin/walkinjob',
            color: '#ed6c02'
        },

        {
            title: 'Review Payments',
            description: 'Review Payments / Transactions',
            icon: <Add sx={{ fontSize: 48, color: '#023dedff' }} />,
            path: '/cashier/slip-verification',
            color: '#ed6c02'
        }
    ];

    return (
        <>
            <HeaderWrapper />
            <CashierContainer>
                <Container maxWidth="lg">
                    <WelcomeSection elevation={0}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Welcome to Cashier Portal
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Hello {user?.name}! Manage payments, invoices, and customer transactions efficiently.
                        </Typography>
                    </WelcomeSection>

                    <Grid container spacing={3}>
                        {dashboardActions.map((action, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <ActionCard 
                                    onClick={() => navigate(action.path)}
                                    sx={{
                                        '&:hover': {
                                            borderLeft: `4px solid ${action.color}`,
                                        }
                                    }}
                                >
                                    <CardContent 
                                        sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100%',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Box sx={{ mb: 2 }}>
                                            {action.icon}
                                        </Box>
                                        <Typography 
                                            variant="h6" 
                                            fontWeight="bold" 
                                            gutterBottom
                                            color={action.color}
                                        >
                                            {action.title}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            color="textSecondary"
                                            sx={{ px: 1 }}
                                        >
                                            {action.description}
                                        </Typography>
                                    </CardContent>
                                </ActionCard>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Quick Stats Section */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    startIcon={<Payment />}
                                    onClick={() => navigate('/cashier')}
                                    sx={{
                                        py: 2,
                                        background: '#D32F2F',
                                        '&:hover': {
                                            background: '#B71C1C',
                                        }
                                    }}
                                >
                                    Start Processing Payments
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    startIcon={<History />}
                                    onClick={() => navigate('/payment-history')}
                                    sx={{ py: 2 }}
                                >
                                    View Recent Transactions
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Footer Info */}
                    <Box sx={{ mt: 6, mb: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="textSecondary">
                            Cashier Portal - Moto-Care Service Center Management System
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            Use the navigation above or click on any card to access different functions
                        </Typography>
                    </Box>
                </Container>
            </CashierContainer>
        </>
    );
};

export default CashierDashboard;