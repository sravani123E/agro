import React from 'react';
import { Container, Typography } from '@mui/material';
import OrderTracking from '../components/OrderTracking';

const Orders: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      <OrderTracking />
    </Container>
  );
};

export default Orders; 