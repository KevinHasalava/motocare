import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, Typography, Paper, Grid, Box, 
    CircularProgress, Alert, Divider, Table, 
    TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Chip, Button 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';

// Assume you created this function in your API file
import { getPurchaseRequestById } from '../../api/purchaseRequestApi'; 

// Helper function to format the status chip color
const getStatusColor = (status) => {
    switch (status) {
        case 'Sent': return 'primary';
        case 'Received': return 'success';
        case 'Cancelled': return 'error';
        default: return 'default';
    }
};

const PurchaseRequestView = () => {
    // Hooks to get the ID from the URL and control navigation
    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            setError('');
            try {
                // Ensure ID exists before fetching
                if (!id) throw new Error("Request ID is missing."); 
                
                const res = await getPurchaseRequestById(id);
                setRequest(res.data);
            } catch (err) {
                console.error("Fetch Request Error:", err);
                const msg = err.response?.data?.message || err.message || 'Failed to load purchase request details.';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id]);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 5 }}>
                <Alert severity="error">{error}</Alert>
                <Box mt={2}>
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={() => navigate('/purchase-requests')}
                        variant="outlined"
                    >
                        Go Back
                    </Button>
                </Box>
            </Container>
        );
    }

    if (!request) {
        return <Container sx={{ py: 5 }}><Alert severity="info">No request found.</Alert></Container>;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">
                    Purchase Request: #{request._id.slice(-6)} 
                </Typography>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => navigate('/purchase-requests')}
                    variant="outlined"
                >
                    Back to List
                </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Request Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="textSecondary">Supplier:</Typography>
                        {/* Note: Assuming 'supplier' is populated (or just displaying the ID if not populated) */}
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {request.supplier.name || request.supplier}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="textSecondary">Status:</Typography>
                        <Chip 
                            label={request.status} 
                            color={getStatusColor(request.status)} 
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="textSecondary">Request Date:</Typography>
                        <Typography variant="body1">
                            {format(new Date(request.requestDate), 'MMM d, yyyy (p)')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">Requested By:</Typography>
                        <Typography variant="body1">{request.sentBy}</Typography>
                    </Grid>
                    {request.notes && (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary">Notes:</Typography>
                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{request.notes}</Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            <Typography variant="h5" sx={{ mb: 2 }}>Requested Items ({request.requestedItems.length})</Typography>
            <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Part Name</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Current Stock</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Quantity Needed</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {request.requestedItems.map((item, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{item.partName}</TableCell>
                                <TableCell align="right">{item.currentStock}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {item.quantityNeeded}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default PurchaseRequestView;