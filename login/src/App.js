// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import ManageProducts from './components/ManageProducts';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext'; // Import CartProvider
import './App.css';

// Kiểm tra xác thực người dùng
const isAuthenticated = () => !!localStorage.getItem('token');

// Kiểm tra vai trò người dùng
const isAdmin = () => localStorage.getItem('role') === 'admin';

// Private Route Component để bảo vệ các route cần đăng nhập
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Route riêng dành cho admin
const AdminRoute = ({ children }) => {
  return isAuthenticated() && isAdmin() ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          {/* Nội dung chính */}
          <div className="main-content">
            <Routes>
              {/* Đường dẫn mặc định, luôn điều hướng đến trang login */}
              <Route
                path="/"
                element={<Navigate to="/login" replace />}
              />
              {/* Các routes khác */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              {/* Bảo vệ route Dashboard cho user */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              {/* Bảo vệ các route chỉ cho phép admin */}
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
              <Route path="/admin/manage-products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
              {/* Route cho danh sách sản phẩm và trang chi tiết sản phẩm */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:productId" element={<ProductDetail />} />
              {/* Route cho giỏ hàng */}
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            </Routes>
          </div>
          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
