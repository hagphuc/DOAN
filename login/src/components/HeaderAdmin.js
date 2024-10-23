import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import './HeaderAdmin.css'; // Giả sử bạn có file CSS riêng cho Header

const logoUrl = `${process.env.PUBLIC_URL}/logo2.jpg`; // Đường dẫn logo

const settings = ['Profile', 'Account', 'Logout']; // Các tùy chọn hồ sơ người dùng

const HeaderAdmin = () => {
  const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#f3c9c4' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <img src={logoUrl} alt="Flower Shop Logo" style={{ height: 40, width: 40 }} />
          </Box>

          {/* Tên cửa hàng */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'inline-block' }, cursor: 'pointer' }}
            onClick={() => navigate('/admin/dashboard')}
          >
            Flower Shop Admin
          </Typography>

          {/* Nút Home */}
          <Button
            color="inherit"
            onClick={() => navigate('/admin/dashboard')}
            sx={{ mx: 2 }}
          >
            Home
          </Button>

          {/* Nút Quản lý User */}
          <Button
            color="inherit"
            onClick={() => navigate('/admin/manage-users')}
            sx={{ mx: 2 }}
          >
            Manage Users
          </Button>

          {/* Nút Quản lý Sản phẩm */}
          <Button
            color="inherit"
            onClick={() => navigate('/admin/manage-products')}
            sx={{ mx: 2 }}
          >
            Manage Products
          </Button>

          {/* Mục Hồ sơ người dùng */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HeaderAdmin;
