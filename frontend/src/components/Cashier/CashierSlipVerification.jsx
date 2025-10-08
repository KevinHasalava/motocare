import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    Chip,
    Avatar,
    Divider,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Visibility as ViewIcon,
    Receipt as ReceiptIcon,
    Person as PersonIcon,
    DirectionsCar as CarIcon,
    Payment as PaymentIcon,
    Pending as PendingIcon,
    Verified as VerifiedIcon,
    Error as ErrorIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getPaymentsWithSlips, verifyPaymentSlip } from '../../api/paymentApi';
import CashierHeader from '../CashierHeader';

// Get backend base URL for file access
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');

// Styled Components
const CashierContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(10),
}));

const MainPaper = styled(Paper)(({ theme }) => ({
    maxWidth: 1400,
    margin: '0 auto',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const ContentSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
}));

const SlipCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: theme.shadows[4],
        transform: 'translateY(-2px)',
    }
}));

const CashierSlipVerification = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    // Dialog states
    const [verifyDialog, setVerifyDialog] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [verificationAction, setVerificationAction] = useState(''); // 'approve' or 'reject'
    const [verificationNotes, setVerificationNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchPendingSlips();
    }, []);

    const fetchPendingSlips = async () => {
        setLoading(true);
        try {
            const response = await getPaymentsWithSlips('', 1, 1000);
            setPayments(response.payments || []);
        } catch (error) {
            console.error('Error fetching pending slips:', error);
            setError('Failed to load payment slips');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleVerifySlip = (payment, action) => {
        setSelectedPayment(payment);
        setVerificationAction(action);
        setVerificationNotes('');
        setVerifyDialog(true);
    };

    const handleVerificationSubmit = async () => {
        if (!selectedPayment || !verificationAction) return;

        setProcessing(true);
        try {
            await verifyPaymentSlip(selectedPayment._id, verificationAction, verificationNotes);

            setSuccess(`Payment slip ${verificationAction === 'approve' ? 'approved' : 'rejected'} successfully`);
            setVerifyDialog(false);
            setSelectedPayment(null);
            fetchPendingSlips(); // Refresh the list
        } catch (error) {
            console.error('Error updating payment slip:', error);
            setError('Failed to update payment slip status');
        } finally {
            setProcessing(false);
        }
    };

    const getSlipStatusColor = (status) => {
        switch (status) {
            case 'Under Review':
                return 'warning';
            case 'Approved':
                return 'info';
            case 'Rejected':
                return 'error';
            case 'Verified':
                return 'success';
            default:
                return 'default';
        }
    };

    const getSlipStatusIcon = (status) => {
        switch (status) {
            case 'Under Review':
                return <PendingIcon />;
            case 'Approved':
                return <CheckCircleIcon />;
            case 'Rejected':
                return <CancelIcon />;
            case 'Verified':
                return <VerifiedIcon />;
            default:
                return <PaymentIcon />;
        }
    };

    const filteredPayments = payments.filter(payment => {
        if (activeTab === 0) return true; // All
        if (activeTab === 1) return payment.paymentSlip.status === 'Under Review';
        if (activeTab === 2) return payment.paymentSlip.status === 'Verified' || payment.paymentSlip.status === 'Approved';
        if (activeTab === 3) return payment.paymentSlip.status === 'Rejected';
        return true;
    });

    return (
        <>
            <CashierHeader />
            <CashierContainer>
                <MainPaper>
                    <HeaderSection>
                        <Box display="flex" alignItems="center">
                            <ReceiptIcon sx={{ fontSize: 40, marginRight: 2 }} />
                            <Box>
                                <Typography variant="h4" fontWeight="bold">
                                    Payment Slip Verification
                                </Typography>
                                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                    Review and verify uploaded payment slips
                                </Typography>
                            </Box>
                        </Box>
                    </HeaderSection>

                    <ContentSection>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                                {success}
                            </Alert>
                        )}

                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs value={activeTab} onChange={handleTabChange}>
                                <Tab label="All Slips" />
                                <Tab label="Under Review" />
                                <Tab label="Verified" />
                                <Tab label="Rejected" />
                            </Tabs>
                        </Box>

                        {loading ? (
                            <Box display="flex" justifyContent="center" py={4}>
                                <CircularProgress />
                            </Box>
                        ) : filteredPayments.length === 0 ? (
                            <Box textAlign="center" py={6}>
                                <ReceiptIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                                <Typography variant="h6" color="textSecondary">
                                    No payment slips found
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Payment slips will appear here when customers upload them
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={2}>
                                {filteredPayments.map((payment) => (
                                    <Grid item xs={12} key={payment._id}>
                                        <SlipCard>
                                            <CardContent>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item xs={12} sm={2}>
                                                        <Box display="flex" alignItems="center">
                                                            {getSlipStatusIcon(payment.paymentSlip.status)}
                                                            <Box ml={1}>
                                                                <Typography variant="h6" fontWeight="bold">
                                                                    {payment.invoiceId}
                                                                </Typography>
                                                                <Chip
                                                                    label={payment.paymentSlip.status}
                                                                    color={getSlipStatusColor(payment.paymentSlip.status)}
                                                                    size="small"
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </Grid>

                                                    <Grid item xs={12} sm={2}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Customer
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {payment.customer?.name || 'N/A'}
                                                        </Typography>
                                                    </Grid>

                                                    <Grid item xs={12} sm={2}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Vehicle
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {payment.vehicle?.vehicleNumber || 'N/A'}
                                                        </Typography>
                                                    </Grid>

                                                    <Grid item xs={12} sm={2}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Amount
                                                        </Typography>
                                                        <Typography variant="h6" color="primary">
                                                            LKR {payment.totalAmount?.toLocaleString() || '0'}
                                                        </Typography>
                                                    </Grid>

                                                    <Grid item xs={12} sm={2}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Uploaded
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {payment.paymentSlip.uploadedAt ?
                                                                new Date(payment.paymentSlip.uploadedAt).toLocaleDateString() :
                                                                'N/A'
                                                            }
                                                        </Typography>
                                                    </Grid>

                                                    <Grid item xs={12} sm={2}>
                                                        <Box display="flex" gap={1}>
                                                            <Tooltip title="View Slip">
                                                                <IconButton
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() => window.open(`${BACKEND_BASE_URL}${payment.paymentSlip.url}`, '_blank')}
                                                                >
                                                                    <ViewIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            {payment.paymentSlip.status === 'Under Review' && (
                                                                <>
                                                                    <Tooltip title="Approve Slip">
                                                                        <IconButton
                                                                            color="success"
                                                                            size="small"
                                                                            onClick={() => handleVerifySlip(payment, 'approve')}
                                                                        >
                                                                            <CheckCircleIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Reject Slip">
                                                                        <IconButton
                                                                            color="error"
                                                                            size="small"
                                                                            onClick={() => handleVerifySlip(payment, 'reject')}
                                                                        >
                                                                            <CancelIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </>
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                {payment.paymentSlip.notes && (
                                                    <Box mt={2}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Customer Notes:
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {payment.paymentSlip.notes}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </SlipCard>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </ContentSection>
                </MainPaper>
            </CashierContainer>

            {/* Verification Dialog */}
            <Dialog
                open={verifyDialog}
                onClose={() => setVerifyDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        {verificationAction === 'approve' ? (
                            <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                        ) : (
                            <CancelIcon sx={{ mr: 1, color: 'error.main' }} />
                        )}
                        {verificationAction === 'approve' ? 'Approve' : 'Reject'} Payment Slip
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedPayment && (
                        <Box mb={3}>
                            <Typography variant="h6" gutterBottom>
                                Invoice: {selectedPayment.invoiceId}
                            </Typography>
                            <Typography variant="body1">
                                Customer: {selectedPayment.customer?.name}
                            </Typography>
                            <Typography variant="body1">
                                Vehicle: {selectedPayment.vehicle?.vehicleNumber}
                            </Typography>
                            <Typography variant="body1" color="primary">
                                Amount: LKR {selectedPayment.totalAmount?.toLocaleString()}
                            </Typography>
                        </Box>
                    )}

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Verification Notes"
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        placeholder={`Add notes for ${verificationAction === 'approve' ? 'approval' : 'rejection'}...`}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setVerifyDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleVerificationSubmit}
                        variant="contained"
                        color={verificationAction === 'approve' ? 'success' : 'error'}
                        disabled={processing}
                        startIcon={processing ? <CircularProgress size={20} /> : null}
                    >
                        {verificationAction === 'approve' ? 'Approve' : 'Reject'} Slip
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CashierSlipVerification;
