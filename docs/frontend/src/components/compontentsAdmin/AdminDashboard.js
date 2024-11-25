import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { People, ShoppingCart, Receipt, Category } from '@mui/icons-material'; // Thêm Category icon
import axios from 'axios'; // Thư viện Axios giúp dễ dàng gọi API
import HeadersAdmin from './HeaderAdmin'; // Thêm HeaderAdmin vào trang

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({
    users: 0,
    products: 0,
    orders: 0,
    categories: 0, // Thêm category vào state
  });

  // Hàm gọi API để lấy dữ liệu thống kê
  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/statistics'); // Gọi đến API `/api/statistics`
      setStatistics(response.data); // Cập nhật dữ liệu thống kê từ response của API
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  };

  // Gọi API khi trang được tải
  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ marginTop: '40px' }}>
      <HeadersAdmin /> {/* Thêm HeaderAdmin vào trang */}
      {/* Tiêu đề trang */}
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: 4, 
          color: 'transparent',  // Single color property (for text transparency)
          lineHeight: 1.2, 
          background: 'linear-gradient(to right, #f3c9c4, #FFB6C1)', 
          WebkitBackgroundClip: 'text', // Apply the gradient to text
        }}
      >
        Admin Dashboard
      </Typography>
      <Grid container spacing={4}>
        {/* Thống kê người dùng */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFEB3B', cursor: 'pointer' }} onClick={() => navigate('/admin/manage-users')}>
            <CardContent> 
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <People sx={{ fontSize: 40, marginRight: 2 }} />
                <Typography variant="h5">Users</Typography>
              </Box>
              <Typography variant="h6">{statistics.users} Users</Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Manage and view all users registered in the system. You can add, update, or remove users here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thống kê sản phẩm */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#8BC34A', cursor: 'pointer' }} onClick={() => navigate('/admin/manage-products')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <ShoppingCart sx={{ fontSize: 40, marginRight: 2 }} />
                <Typography variant="h5">Products</Typography>
              </Box>
              <Typography variant="h6">{statistics.products} Products</Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                View and manage the list of products available for sale. You can add, edit, or remove products here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thống kê đơn hàng */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#03A9F4', cursor: 'pointer' }} onClick={() => navigate('/admin/manage-orders')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Receipt sx={{ fontSize: 40, marginRight: 2 }} />
                <Typography variant="h5">Orders</Typography>
              </Box>
              <Typography variant="h6">{statistics.orders} Orders</Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Manage and track all the orders placed by customers. You can view order details and update their status.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Thống kê danh mục */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#9C27B0', cursor: 'pointer' }} onClick={() => navigate('/admin/manage-categories')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Category sx={{ fontSize: 40, marginRight: 2 }} />
                <Typography variant="h5">Categories</Typography>
              </Box>
              <Typography variant="h6">{statistics.categories} Categories</Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                View and manage different product categories. Add, edit, or delete categories to organize your products.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
