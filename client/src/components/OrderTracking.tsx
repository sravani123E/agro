import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';

const OrderTracking: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'In Progress':
        return 'info';
      case 'Delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          Please log in to view your orders.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                    />
                  </TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSelectedOrder(order);
                        setOpenDialog(true);
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1">No orders found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography variant="h6" gutterBottom>
                Order #{selectedOrder._id}
              </Typography>
              <Typography>Status: {selectedOrder.status}</Typography>
              <Typography>Date: {new Date(selectedOrder.createdAt).toLocaleString()}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Delivery Details:
              </Typography>
              <Typography>Name: {selectedOrder.customerName}</Typography>
              <Typography>Contact: {selectedOrder.contactNumber}</Typography>
              <Typography>Address: {selectedOrder.deliveryAddress}</Typography>
              {selectedOrder.notes && (
                <Typography>Notes: {selectedOrder.notes}</Typography>
              )}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Items:
              </Typography>
              {selectedOrder.items.map((item, index) => (
                <Typography key={index}>
                  {item.name} - {item.quantity} units @ ${item.price} each
                </Typography>
              ))}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total Amount: ${selectedOrder.totalAmount}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderTracking; 