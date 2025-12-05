import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Divider,
    Grid,
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material';
import { Print, Close, Receipt, Business } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getPaymentByInvoiceId } from '../../api/paymentApi';

const InvoicePaper = styled(Paper)(({ theme }) => ({
    maxWidth: 800,
    margin: '0 auto',
    padding: theme.spacing(4),
    backgroundColor: '#fff',
    '@media print': {
        boxShadow: 'none',
        margin: 0,
        maxWidth: 'none',
        padding: theme.spacing(2),
    }
}));

const InvoiceHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    borderBottom: '2px solid #333',
}));

const CompanyInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const InvoiceTitle = styled(Typography)(({ theme }) => ({
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: theme.spacing(1),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
}));

const PrintButton = styled(Button)(({ theme }) => ({
    '@media print': {
        display: 'none',
    }
}));

const Invoice = ({ invoiceId, open, onClose }) => {
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (invoiceId && open) {
            fetchInvoice();
        }
    }, [invoiceId, open]);

    const fetchInvoice = async () => {
        setLoading(true);
        try {
            const invoiceData = await getPaymentByInvoiceId(invoiceId);
            setPayment(invoiceData);
        } catch (error) {
            console.error('Error fetching invoice:', error);
            setError('Failed to load invoice');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!payment) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogContent>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        {loading ? 'Loading invoice...' : error || 'No invoice data'}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const InvoiceContent = () => (
        <InvoicePaper elevation={3}>
            {/* Header */}
            <InvoiceHeader>
                <CompanyInfo>
                    <Business sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Moto-Care
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Vehicle Service Center
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Professional Vehicle Maintenance & Repair
                        </Typography>
                    </Box>
                </CompanyInfo>
                <Box textAlign="right">
                    <InvoiceTitle>INVOICE</InvoiceTitle>
                    <Typography variant="h6" color="primary">
                        {payment.invoiceId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Date: {formatDate(payment.createdAt)}
                    </Typography>
                </Box>
            </InvoiceHeader>

            {/* Customer & Vehicle Info */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                    <SectionTitle>Bill To:</SectionTitle>
                    <Typography variant="h6">{payment.customer?.name || 'N/A'}</Typography>
                    <Typography variant="body2">{payment.customer?.email || 'N/A'}</Typography>
                    <Typography variant="body2">{payment.customer?.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <SectionTitle>Vehicle Details:</SectionTitle>
                    <Typography variant="body1">
                        <strong>Vehicle No:</strong> {payment.vehicle?.vehicleNumber || 'N/A'}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Vehicle:</strong> {payment.vehicle?.brand || 'N/A'} {payment.vehicle?.model || ''}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Type:</strong> {payment.vehicle?.type || 'N/A'}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Year:</strong> {payment.vehicle?.year || 'N/A'}
                    </Typography>
                </Grid>
            </Grid>

            {/* Job Details */}
            {payment.job && (
                <Box sx={{ mb: 3 }}>
                    <SectionTitle>Job Information:</SectionTitle>
                    <Typography variant="body1">
                        <strong>Job ID:</strong> {payment.job.jobId || 'N/A'}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Service:</strong> {payment.service?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Status:</strong> {payment.job.status || 'N/A'}
                    </Typography>
                </Box>
            )}

            {/* Services & Items Table */}
            <TableContainer component={Box} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell align="center"><strong>Quantity</strong></TableCell>
                            <TableCell align="right"><strong>Unit Price (LKR)</strong></TableCell>
                            <TableCell align="right"><strong>Total (LKR)</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Service Row */}
                        {payment.service && (
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1">
                                        <strong>{payment.service.name || 'Service'}</strong>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Service Duration: {payment.service.duration || 'N/A'} minutes
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">1</TableCell>
                                <TableCell align="right">
                                    {(payment.serviceAmount || 0).toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                    <strong>{(payment.serviceAmount || 0).toLocaleString()}</strong>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Extra Items */}
                        {payment.extraItems && payment.extraItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Typography variant="body1">{item.itemName}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Extra Part/Item
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">{item.quantity}</TableCell>
                                <TableCell align="right">
                                    {item.unitPrice.toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                    <strong>{item.totalPrice.toLocaleString()}</strong>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Payment Summary */}
            <Box sx={{ mb: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <SectionTitle>Payment Details:</SectionTitle>
                        <Typography variant="body1">
                            <strong>Payment Method:</strong> {payment.paymentMethod}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Payment Status:</strong> {payment.paymentStatus}
                        </Typography>
                        {payment.notes && (
                            <Typography variant="body1">
                                <strong>Notes:</strong> {payment.notes}
                            </Typography>
                        )}
                        {payment.cashier && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                Processed by: {payment.cashier.name || 'N/A'}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 1 }}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body1">Subtotal:</Typography>
                                <Typography variant="body1">
                                    LKR {(payment.subtotal || 0).toLocaleString()}
                                </Typography>
                            </Box>
                            {payment.discount > 0 && (
                                <Box display="flex" justifyContent="space-between" color="error.main">
                                    <Typography variant="body1">
                                        Discount {payment.discountPercentage > 0 ? `(${payment.discountPercentage}%)` : ''}:
                                    </Typography>
                                    <Typography variant="body1">
                                        -LKR {(payment.discount || 0).toLocaleString()}
                                    </Typography>
                                </Box>
                            )}
                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6" fontWeight="bold">
                                    Total Amount:
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    LKR {(payment.totalAmount || 0).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee', textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    Thank you for choosing Moto-Care for your vehicle service needs!
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    For any queries regarding this invoice, please contact us with Invoice ID: {payment.invoiceId}
                </Typography>
            </Box>

            {/* Print Button */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <PrintButton
                    variant="contained"
                    startIcon={<Print />}
                    onClick={handlePrint}
                    size="large"
                >
                    Print Invoice
                </PrintButton>
            </Box>
        </InvoicePaper>
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { maxHeight: '90vh' }
            }}
        >
            <DialogActions sx={{ justifyContent: 'space-between', p: 1 }}>
                <Box display="flex" alignItems="center">
                    <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Invoice - {payment.invoiceId}</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogActions>
            <DialogContent sx={{ p: 0 }}>
                <InvoiceContent />
            </DialogContent>
        </Dialog>
    );
};

export default Invoice;