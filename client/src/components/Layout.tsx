import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { ShoppingCart, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Cart', path: '/cart' },
    { label: 'Orders', path: '/orders' },
  ];

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{
        '& .MuiDrawer-paper': {
          width: 250,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.label}
            component={RouterLink}
            to={item.path}
            onClick={toggleMobileMenu}
            sx={{ color: theme.palette.text.primary }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Divider />
        {user ? (
          <>
            {user.role === 'admin' && (
              <ListItem
                component={RouterLink}
                to="/admin"
                onClick={toggleMobileMenu}
                sx={{ color: theme.palette.text.primary }}
              >
                <ListItemText primary="Admin Dashboard" />
              </ListItem>
            )}
            <ListItem
              component={RouterLink}
              to="/profile"
              onClick={toggleMobileMenu}
              sx={{ color: theme.palette.text.primary }}
            >
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem onClick={handleLogout} sx={{ color: theme.palette.text.primary }}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              component={RouterLink}
              to="/login"
              onClick={toggleMobileMenu}
              sx={{ color: theme.palette.text.primary }}
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              component={RouterLink}
              to="/register"
              onClick={toggleMobileMenu}
              sx={{ color: theme.palette.text.primary }}
            >
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              FRESH MARKET
            </Typography>

            {isMobile ? (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileMenu}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.path}
                    color="inherit"
                    sx={{ textTransform: 'none' }}
                  >
                    {item.label}
                  </Button>
                ))}
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Button
                        component={RouterLink}
                        to="/admin"
                        color="inherit"
                        sx={{ textTransform: 'none' }}
                      >
                        Admin Dashboard
                      </Button>
                    )}
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose} component={RouterLink} to="/profile">
                        Profile
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      color="inherit"
                      sx={{ textTransform: 'none' }}
                    >
                      Login
                    </Button>
                    {!user && (
                      <Button
                        component={RouterLink}
                        to="/register"
                        variant="contained"
                        color="primary"
                        sx={{ textTransform: 'none' }}
                      >
                        Register
                      </Button>
                    )}
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu()}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout; 