import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Stack,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { getAllPurchaseRequests } from '../../api/purchaseRequestApi';

// Status configuration with icons
const STATUS_CONFIG = {
  Sent: { 
    color: 'primary', 
    label: 'Sent',
    icon: LocalShippingIcon,
    bgColor: 'rgba(25, 118, 210, 0.08)'
  },
  Received: { 
    color: 'success', 
    label: 'Received',
    icon: CheckCircleIcon,
    bgColor: 'rgba(46, 125, 50, 0.08)'
  },
  Cancelled: { 
    color: 'error', 
    label: 'Cancelled',
    icon: CancelIcon,
    bgColor: 'rgba(211, 47, 47, 0.08)'
  },
  Pending: { 
    color: 'warning', 
    label: 'Pending',
    icon: PendingActionsIcon,
    bgColor: 'rgba(237, 108, 2, 0.08)'
  },
  default: { 
    color: 'default', 
    label: 'Unknown',
    icon: DescriptionIcon,
    bgColor: 'rgba(0, 0, 0, 0.04)'
  }
};

// Empty State Component
const EmptyStateCell = ({ icon: Icon, label, subtext }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      p: 0.5,
      borderRadius: 1,
      bgcolor: 'grey.50',
      border: '1px dashed',
      borderColor: 'grey.300',
      minHeight: 40
    }}
  >
    <Icon sx={{ fontSize: 18, color: 'grey.500' }} />
    <Box>
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'grey.600',
          fontStyle: 'italic',
          display: 'block',
          lineHeight: 1.2
        }}
      >
        {label}
      </Typography>
      {subtext && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'grey.400',
            fontSize: '0.65rem',
            display: 'block'
          }}
        >
          {subtext}
        </Typography>
      )}
    </Box>
  </Box>
);

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return null;
  }
};

// RequestItems tooltip component
const RequestItemsTooltip = ({ items = [] }) => (
  <Box sx={{ p: 1.5, maxWidth: 350 }}>
    <Typography 
      variant="subtitle2" 
      sx={{ 
        mb: 1.5, 
        borderBottom: '1px solid rgba(255,255,255,0.2)', 
        pb: 1,
        fontWeight: 600
      }}
    >
      Requested Items ({items.length})
    </Typography>
    <Stack spacing={1.5}>
      {items.map((item, idx) => (
        <Box 
          key={idx} 
          sx={{ 
            p: 1,
            borderRadius: 1,
            bgcolor: 'rgba(255,255,255,0.1)'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {item.partName}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography variant="caption" color="text.secondary">
              Qty: <strong>{item.quantityNeeded}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Stock: <strong>{item.currentStock || 'N/A'}</strong>
            </Typography>
          </Stack>
        </Box>
      ))}
    </Stack>
  </Box>
);

const PurchaseRequestListPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('requestDate');
  const [order, setOrder] = useState('desc');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getAllPurchaseRequests();
      
      // Normalize the data
      const normalizedData = data.map(request => ({
        id: request._id,
        supplierName: request.supplier?.name || null,
        requestDate: request.requestDate,
        requestDateFormatted: formatDate(request.requestDate),
        status: request.status || null,
        sentBy: request.sentBy || null,
        notes: request.notes || null,
        requestedItems: Array.isArray(request.requestedItems) ? request.requestedItems : [],
      }));
      
      setRequests(normalizedData);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setError(err.response?.data?.message || 'Failed to load purchase requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Calculate statistics
  const stats = {
    total: requests.length,
    sent: requests.filter(r => r.status === 'Sent').length,
    received: requests.filter(r => r.status === 'Received').length,
    pending: requests.filter(r => r.status === 'Pending').length,
    cancelled: requests.filter(r => r.status === 'Cancelled').length
  };

  // Filter requests based on search
  const filteredRequests = requests.filter(request => 
    (request.supplierName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    (request.sentBy?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    (request.status?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    (request.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  // Sorting function
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    // Handle null values
    if (aValue === null) aValue = '';
    if (bValue === null) bValue = '';

    // Handle items count sorting
    if (orderBy === 'requestedItems') {
      aValue = a.requestedItems.length;
      bValue = b.requestedItems.length;
    }

    // Handle date sorting
    if (orderBy === 'requestDate') {
      aValue = a.requestDate ? new Date(a.requestDate).getTime() : 0;
      bValue = b.requestDate ? new Date(b.requestDate).getTime() : 0;
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRequests = sortedRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                mb: 0.5
              }}
            >
              Purchase Requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and track all purchase requests
            </Typography>
          </Box>
          <IconButton 
            onClick={fetchRequests}
            disabled={loading}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark'
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground'
              }
            }}
            size="large"
          >
            <RefreshIcon />
          </IconButton>
        </Stack>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Requests
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {stats.total}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: STATUS_CONFIG.Pending.bgColor, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 500 }}>
                    Pending
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                    {stats.pending}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: STATUS_CONFIG.Sent.bgColor, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="primary.dark" sx={{ fontWeight: 500 }}>
                    Sent
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                    {stats.sent}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: STATUS_CONFIG.Received.bgColor, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="success.dark" sx={{ fontWeight: 500 }}>
                    Received
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.dark' }}>
                    {stats.received}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: STATUS_CONFIG.Cancelled.bgColor, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="error.dark" sx={{ fontWeight: 500 }}>
                    Cancelled
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.dark' }}>
                    {stats.cancelled}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search by supplier, status, sent by, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: 'white',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Table */}
      <Paper 
        sx={{ 
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    bgcolor: '#f8fafc',
                    fontWeight: 700,
                    borderBottom: '2px solid rgba(224, 224, 224, 0.8)',
                    minWidth: 200
                  }}
                >
                  <TableSortLabel
                    active={orderBy === 'supplierName'}
                    direction={orderBy === 'supplierName' ? order : 'asc'}
                    onClick={() => handleRequestSort('supplierName')}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <span>Supplier</span>
                    </Stack>
                  </TableSortLabel>
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#f8fafc',
                    fontWeight: 700,
                    borderBottom: '2px solid rgba(224, 224, 224, 0.8)',
                    minWidth: 150
                  }}
                >
                  <TableSortLabel
                    active={orderBy === 'requestedItems'}
                    direction={orderBy === 'requestedItems' ? order : 'asc'}
                    onClick={() => handleRequestSort('requestedItems')}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <InventoryIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <span>Items</span>
                    </Stack>
                  </TableSortLabel>
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#f8fafc',
                    fontWeight: 700,
                    borderBottom: '2px solid rgba(224, 224, 224, 0.8)',
                    minWidth: 180
                  }}
                >
                  <TableSortLabel
                    active={orderBy === 'requestDate'}
                    direction={orderBy === 'requestDate' ? order : 'asc'}
                    onClick={() => handleRequestSort('requestDate')}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <span>Request Date</span>
                    </Stack>
                  </TableSortLabel>
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#f8fafc',
                    fontWeight: 700,
                    borderBottom: '2px solid rgba(224, 224, 224, 0.8)',
                    minWidth: 140
                  }}
                >
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <InfoOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <span>Status</span>
                    </Stack>
                  </TableSortLabel>
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#f8fafc',
                    fontWeight: 700,
                    borderBottom: '2px solid rgba(224, 224, 224, 0.8)',
                    minWidth: 160
                  }}
                >
                  <TableSortLabel
                    active={orderBy === 'sentBy'}
                    direction={orderBy === 'sentBy' ? order : 'asc'}
                    onClick={() => handleRequestSort('sentBy')}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <span>Sent By</span>
                    </Stack>
                  </TableSortLabel>
                </TableCell>
                <TableCell 
                  sx={{ 
                    bgcolor: '#f8fafc',
                    fontWeight: 700,
                    borderBottom: '2px solid rgba(224, 224, 224, 0.8)',
                    minWidth: 200
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <DescriptionIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <span>Notes</span>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8 }}>
                    <Stack alignItems="center" spacing={2}>
                      <CircularProgress size={48} />
                      <Typography variant="body2" color="text.secondary">
                        Loading purchase requests...
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : paginatedRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'No requests found matching your search' : 'No purchase requests available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRequests.map((request) => {
                  const statusConfig = request.status 
                    ? (STATUS_CONFIG[request.status] || STATUS_CONFIG.default)
                    : null;
                  const StatusIcon = statusConfig?.icon;
                  const items = request.requestedItems || [];

                  return (
                    <TableRow 
                      key={request.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(25, 118, 210, 0.04)',
                          cursor: 'pointer'
                        }
                      }}
                    >
                      <TableCell>
                        {request.supplierName ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                flexShrink: 0
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {request.supplierName}
                            </Typography>
                          </Box>
                        ) : (
                          <EmptyStateCell 
                            icon={BusinessIcon} 
                            label="No supplier selected" 
                            subtext="Select from dropdown"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {items.length === 0 ? (
                          <EmptyStateCell 
                            icon={RemoveCircleOutlineIcon} 
                            label="No items added" 
                            subtext="Add items to request"
                          />
                        ) : (
                          <Tooltip
                            title={<RequestItemsTooltip items={items} />}
                            arrow
                            placement="right"
                          >
                            <Badge 
                              badgeContent={items.length} 
                              color="primary"
                              sx={{
                                '& .MuiBadge-badge': {
                                  right: -3,
                                  top: 3
                                }
                              }}
                            >
                              <Chip
                                icon={<InventoryIcon sx={{ fontSize: 16 }} />}
                                label={`${items.length} item${items.length !== 1 ? 's' : ''}`}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  cursor: 'pointer',
                                  '&:hover': { 
                                    bgcolor: 'action.hover',
                                    borderColor: 'primary.main'
                                  }
                                }}
                              />
                            </Badge>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.requestDateFormatted ? (
                          <Typography variant="body2" color="text.secondary">
                            {request.requestDateFormatted}
                          </Typography>
                        ) : (
                          <EmptyStateCell 
                            icon={CalendarTodayIcon} 
                            label="No date set" 
                            subtext="Select date"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {statusConfig ? (
                          <Chip
                            icon={<StatusIcon sx={{ fontSize: 16 }} />}
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                            sx={{ 
                              minWidth: 110,
                              fontWeight: 600,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                        ) : (
                          <EmptyStateCell 
                            icon={InfoOutlinedIcon} 
                            label="No status" 
                            subtext="Set status"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {request.sentBy ? (
                          <Typography variant="body2">
                            {request.sentBy}
                          </Typography>
                        ) : (
                          <EmptyStateCell 
                            icon={PersonOutlineIcon} 
                            label="Not assigned" 
                            subtext="Assign sender"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {request.notes ? (
                          <Tooltip title={request.notes} arrow>
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 300
                              }}
                            >
                              {request.notes}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5,
                              color: 'text.disabled'
                            }}
                          >
                            <DescriptionIcon sx={{ fontSize: 16 }} />
                            <Typography 
                              variant="caption" 
                              sx={{ fontStyle: 'italic' }}
                            >
                              No notes added
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '2px solid rgba(224, 224, 224, 0.8)',
            bgcolor: '#f8fafc'
          }}
        />
      </Paper>
    </Box>
  );
};

export default PurchaseRequestListPage;