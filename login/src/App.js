import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard'; // Import component quản trị viên
import ManageUsers from './components/ManageUsers'; // Import quản lý user
import ManageProducts from './components/ManageProducts'; // Import quản lý sản phẩm
import Footer from './components/Footer';
import './App.css';

// Private Route Component để bảo vệ các route cần đăng nhập
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Kiểm tra token trong localStorage
  return token ? children : <Navigate to="/login" />; // Nếu có token, cho phép truy cập, ngược lại chuyển hướng tới login
};

// Route riêng dành cho admin
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Kiểm tra token
  const role = localStorage.getItem('role'); // Kiểm tra vai trò của người dùng
  return token && role === 'admin' ? children : <Navigate to="/login" />; // Nếu có token và role là admin, cho phép truy cập, ngược lại chuyển hướng tới login
};

function App() {
  return (
    <Router>
      <div className="App">
        <div className="main-content">
          <Routes>
            {/* Đường dẫn mặc định, chuyển hướng về trang login */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Các routes khác */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
            <Route path="/admin/manage-products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
