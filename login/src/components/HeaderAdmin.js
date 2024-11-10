import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';

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
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(to right, #f3c9c4, #FFB6C1)', // Gradient nền
        padding: '4px 16px', // Giảm khoảng đệm để giảm chiều cao
        zIndex: 1000, // Đảm bảo nó nằm trên các thành phần khác
        height: '60px', // Cố định chiều cao nếu cần
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '40px', padding: '0px' }}> {/* Giảm chiều cao của Toolbar */}
          {/* Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <img src={logoUrl} alt="Flower Shop Logo" style={{ height: 30, width: 30 }} /> {/* Giảm kích thước logo nếu cần */}
          </Box>

          {/* Tên cửa hàng */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              lineHeight: '1.5', // Giảm chiều cao dòng
              fontSize: '1rem', // Giảm kích thước font nếu cần
            }}
            onClick={() => navigate('/admin/dashboard')}
          >
            Flower Paradise
          </Typography>

          {/* Nút Home */}
          <Button
            color="inherit"
            onClick={() => navigate('/admin/dashboard')}
            sx={{ mx: 1, padding: '4px 8px' }} // Giảm padding của button
          >
            Home
          </Button>

          {/* Nút Quản lý User */}
          <Button
            color="inherit"
            onClick={() => navigate('/admin/manage-users')}
            sx={{ mx: 1, padding: '4px 8px' }} // Giảm padding của button
          >
            Manage Users
          </Button>

          {/* Nút Quản lý Sản phẩm */}
          <Button
            color="inherit"
            onClick={() => navigate('/admin/manage-products')}
            sx={{ mx: 1, padding: '4px 8px' }} // Giảm padding của button
          >
            Manage Products
          </Button>
          <Button 
          color="inherit"
          onClick={() => navigate('/admin/manage-orders')} 
          sx={{ mx: 1, padding: '4px 8px' }} // Giảm padding của button
          >
            Manage Orders
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
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
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
