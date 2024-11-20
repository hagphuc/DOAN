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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { useCart } from '../components/CartContext'; // Import CartContext
import axios from 'axios'; // Import axios để gọi API

const logoUrl = `${process.env.PUBLIC_URL}/logo2.jpg`;

const pages = ['Home', 'Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Logout'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElCategory, setAnchorElCategory] = React.useState(null); // Để mở menu danh mục
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [categories, setCategories] = React.useState([]); // Lưu danh sách danh mục từ API
  const [loadingCategories, setLoadingCategories] = React.useState(true); // Trạng thái khi đang lấy dữ liệu
  const [categoryError, setCategoryError] = React.useState(false); // Lỗi khi lấy danh mục

  // Sử dụng CartContext để lấy số lượng giỏ hàng
  const { cartItems } = useCart();
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0); // Tính tổng số lượng giỏ hàng

  // Gọi API để lấy danh mục khi component render
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories'); // Đảm bảo đường dẫn API đúng
        if (response.data) {
          setCategories(response.data); // Lưu dữ liệu danh mục vào state
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        setCategoryError(true); // Đánh dấu có lỗi khi lấy danh mục
      } finally {
        setLoadingCategories(false); // Dữ liệu đã được tải
      }
    };

    fetchCategories(); // Gọi API
  }, []); // Đảm bảo useEffect chỉ chạy một lần khi component được render lần đầu tiên

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenCategoryMenu = (event) => {
    setAnchorElCategory(event.currentTarget); // Mở menu danh mục khi nhấn vào "Danh mục"
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

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  const handlePageChange = (page) => {
    switch(page) {
      case 'Home':
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
    navigate(`/category/${categoryId}`); // Điều hướng đến trang danh mục
    handleCloseCategoryMenu(); // Đóng menu danh mục sau khi chọn
  };

  return (
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(to right, #f3c9c4, #FFB6C1)',
      boxShadow: 'none',
    }}>
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

            {/* Mục danh mục */}
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
}

export default ResponsiveAppBar;