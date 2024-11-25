import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { useCart } from './CartContext'; // Import useCart hook
import axios from 'axios'; // Import axios để gọi API

const logoUrl = `${process.env.PUBLIC_URL}/logo2.jpg`;

const pages = ['TRANG CHỦ', 'SẢN PHẨM', 'Pricing', 'Blog'];
const settings = ['HỒ SƠ', 'TÀI KHOẢN', 'ĐĂNG XUẤT'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElCategory, setAnchorElCategory] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categories, setCategories] = React.useState([]);
  const [loadingCategories, setLoadingCategories] = React.useState(true);
  const [categoryError, setCategoryError] = React.useState(false);

  const { cartItems } = useCart();
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Lấy thông tin người dùng từ localStorage
  const username = localStorage.getItem('username') || 'Guest';  // Lấy tên người dùng từ localStorage
  const userAvatar = localStorage.getItem('avatar') || '/static/images/avatar/2.jpg'; // Lấy ảnh đại diện

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        setCategoryError(true);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenCategoryMenu = (event) => {
    setAnchorElCategory(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseCategoryMenu = () => {
    setAnchorElCategory(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    navigate('/login');
  };

  const handlePageChange = (page) => {
    switch (page) {
      case 'TRANG CHỦ':
        navigate('/dashboard');
        break;
      case 'Pricing':
        navigate('/pricing');
        break;
      case 'Blog':
        navigate('/blog');
        break;
      default:
        break;
    }
    handleCloseNavMenu();
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
    handleCloseCategoryMenu();
  };

  return (
    <>
      {/* AppBar cố định */}
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(to right, #f3c9c4, #FFB6C1)',
          boxShadow: 'none',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
              <img src={logoUrl} alt="Flower Shop Logo" style={{ height: 40, width: 40 }} />
            </Box>

            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Flower Paradise
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => { handlePageChange(page); handleCloseNavMenu(); }}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => { handlePageChange(page); handleCloseNavMenu(); }}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}

              <Button
                onClick={handleOpenCategoryMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Danh mục
              </Button>
              <Menu
                anchorEl={anchorElCategory}
                open={Boolean(anchorElCategory)}
                onClose={handleCloseCategoryMenu}
              >
                {loadingCategories ? (
                  <MenuItem disabled>Loading categories...</MenuItem>
                ) : categoryError ? (
                  <MenuItem disabled>Error fetching categories</MenuItem>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <MenuItem key={category._id} onClick={() => handleCategoryClick(category._id)}>
                      {category.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No categories available</MenuItem>
                )}
              </Menu>
            </Box>

            <TextField
              variant="outlined"
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
              sx={{ bgcolor: 'white', borderRadius: 1, mx: 2 }}
            />

            <IconButton
              size="large"
              aria-label="shopping cart"
              onClick={() => navigate('/cart')}
              color="inherit"
            >
              <Badge badgeContent={cartQuantity} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={username} src={userAvatar} />
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
                  <MenuItem key={setting} onClick={setting === 'ĐĂNG XUẤT' ? handleLogout : handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Không gian bù để tránh che nội dung */}
      <Box sx={{ height: '64px' }} /> {/* Chiều cao AppBar */}
    </>
  );
}

export default ResponsiveAppBar;
