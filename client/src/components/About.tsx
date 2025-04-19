import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  LocalGroceryStore,
  Security,
  Speed,
  ShoppingCart,
  Payment,
  LocalShipping,
} from '@mui/icons-material';

const About: React.FC = () => {
  const features = [
    {
      icon: <LocalGroceryStore />,
      title: 'Fresh Products',
      description: 'Wide selection of fresh fruits and vegetables',
    },
    {
      icon: <Security />,
      title: 'Secure Shopping',
      description: 'Safe and secure payment processing',
    },
    {
      icon: <Speed />,
      title: 'Fast Delivery',
      description: 'Quick delivery to your doorstep',
    },
    {
      icon: <ShoppingCart />,
      title: 'Easy Shopping',
      description: 'User-friendly interface for smooth shopping experience',
    },
    {
      icon: <Payment />,
      title: 'Multiple Payment Options',
      description: 'Various payment methods accepted',
    },
    {
      icon: <LocalShipping />,
      title: 'Order Tracking',
      description: 'Real-time tracking of your orders',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          About Fresh Market
        </Typography>
        
        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          Fresh Market is your one-stop destination for fresh, high-quality fruits and vegetables.
          We are committed to providing the best products and service to our customers.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Our Features
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  height: '100%',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ color: 'primary.main' }}>
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Why Choose Us?
          </Typography>
          <Typography variant="body1" paragraph>
            At Fresh Market, we prioritize quality and customer satisfaction. Our team carefully
            selects the best products to ensure you receive only the finest fruits and vegetables.
            With our user-friendly platform, secure payment system, and reliable delivery service,
            shopping for fresh produce has never been easier.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default About; 