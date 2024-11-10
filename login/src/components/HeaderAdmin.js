// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Tooltip from '@mui/material/Tooltip';
// import Container from '@mui/material/Container';

// const logoUrl = `${process.env.PUBLIC_URL}/logo2.jpg`; // Đường dẫn logo

// const settings = ['Profile', 'Account', 'Logout'];

// const HeaderAdmin = () => {
//   const navigate = useNavigate();
//   const [anchorElUser, setAnchorElUser] = React.useState(null);

//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         background: 'linear-gradient(to right, #f3c9c4, #FFB6C1)',
//         padding: '4px 16px',
//         zIndex: 1000,
//         height: '60px',
//       }}
//     >
//       <Container maxWidth="xl">
//         <Toolbar disableGutters sx={{ minHeight: '40px', padding: '0px' }}>
//           <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
//             <img src={logoUrl} alt="Flower Shop Logo" style={{ height: 30, width: 30 }} />
//           </Box>

//           <Typography
//             variant="h6"
//             noWrap
//             component="div"
//             sx={{
//               flexGrow: 1,
//               display: { xs: 'flex', md: 'inline-block' },
//               cursor: 'pointer',
//               lineHeight: '1.5',
//               fontSize: '1rem',
//             }}
//             onClick={() => navigate('/admin/dashboard')}
//           >
//             Flower Paradise
//           </Typography>

//           {/* Nút Home */}
//           <Button
//             color="inherit"
//             onClick={() => navigate('/admin/dashboard')}
//             sx={{ mx: 1, padding: '4px 8px' }}
//           >
//             Home
//           </Button>

//           {/* Nút Quản lý User */}
//           <Button
//             color="inherit"
//             onClick={() => navigate('/admin/manage-users')}
//             sx={{ mx: 1, padding: '4px 8px' }}
//           >
//             Manage Users
//           </Button>

//           {/* Nút Quản lý Sản phẩm */}
//           <Button
//             color="inherit"
//             onClick={() => navigate('/admin/manage-products')}
//             sx={{ mx: 1, padding: '4px 8px' }}
//           >
//             Manage Products
//           </Button>

//           {/* Nút Quản lý Đơn hàng */}
//           <Button 
//             color="inherit"
//             onClick={() => navigate('/admin/manage-orders')} 
//             sx={{ mx: 1, padding: '4px 8px' }}
//           >
//             Manage Orders
//           </Button>

//           {/* Nút Quản lý Danh mục */}
//           <Button
//             color="inherit"
//             onClick={() => navigate('/admin/manage-categories')}
//             sx={{ mx: 1, padding: '4px 8px' }}
//           >
//             Manage Categories
//           </Button>

//           {/* Mục Hồ sơ người dùng */}
//           <Box sx={{ flexGrow: 0 }}>
//             <Tooltip title="Open settings">
//               <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                 <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
//               </IconButton>
//             </Tooltip>
//             <Menu
//               sx={{ mt: '45px' }}
//               id="menu-appbar"
//               anchorEl={anchorElUser}
//               anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               open={Boolean(anchorElUser)}
//               onClose={handleCloseUserMenu}
//             >
//               {settings.map((setting) => (
//                 <MenuItem key={setting} onClick={setting === 'Logout' ? handleLogout : handleCloseUserMenu}>
//                   <Typography textAlign="center">{setting}</Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// };

// export default HeaderAdmin;

import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ReceiptIcon from '@mui/icons-material/Receipt'; // Icon cho "Manage Orders"

const logoUrl = `${process.env.PUBLIC_URL}/logo2.jpg`;
const settings = ['Profile', 'Account', 'Logout'];

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElFunction, setAnchorElFunction] = React.useState(null);

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

  const handleOpenFunctionMenu = (event) => {
    setAnchorElFunction(event.currentTarget);
  };

  const handleCloseFunctionMenu = () => {
    setAnchorElFunction(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(to right, #f3c9c4, #FFB6C1)',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '4px 16px',
        zIndex: 1000,
        height: '70px',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '40px', padding: '0px' }}>
          
          {/* Icon Menu ở góc trái */}
          <IconButton
            color="inherit"
            onClick={handleOpenFunctionMenu}
            sx={{ mx: 1 }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            <img src={logoUrl} alt="Logo" style={{ height: 40, width: 40 }} />
          </Box>

          {/* Tên thương hiệu */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
            onClick={() => navigate('/admin/dashboard')}
          >
            Flower Paradise
          </Typography>

          {/* Menu chức năng */}
          <Menu
            anchorEl={anchorElFunction}
            open={Boolean(anchorElFunction)}
            onClose={handleCloseFunctionMenu}
            sx={{ mt: '45px' }}
          >
            <MenuItem onClick={() => { handleCloseFunctionMenu(); navigate('/admin/dashboard'); }}>
              <HomeIcon sx={{ mr: 1 }} /> Home
            </MenuItem>
            <MenuItem onClick={() => { handleCloseFunctionMenu(); navigate('/admin/manage-users'); }}>
              <PersonIcon sx={{ mr: 1 }} /> Manage Users
            </MenuItem>
            <MenuItem onClick={() => { handleCloseFunctionMenu(); navigate('/admin/manage-products'); }}>
              <ShoppingCartIcon sx={{ mr: 1 }} /> Manage Products
            </MenuItem>
            <MenuItem onClick={() => { handleCloseFunctionMenu(); navigate('/admin/manage-orders'); }}>
              <ReceiptIcon sx={{ mr: 1 }} /> Manage Orders
            </MenuItem>
            <MenuItem onClick={() => { handleCloseFunctionMenu(); navigate('/admin/manage-categories'); }}>
              <CategoryIcon sx={{ mr: 1 }} /> Manage Categories
            </MenuItem>
          </Menu>

          {/* Hồ sơ người dùng */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
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
