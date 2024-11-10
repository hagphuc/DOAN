import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import ManageProducts from './components/ManageProducts';
import ManageOrders from './components/ManageOrders'; // Import ManageOrders component
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';
import './App.css';

// Function to check if the user is authenticated
const isAuthenticated = () => !!localStorage.getItem('token');

// Function to check if the user is an admin
const isAdmin = () => localStorage.getItem('role') === 'admin';

// Private Route Component for authenticated access
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Admin Route Component for admin-only access
const AdminRoute = ({ children }) => {
  return isAuthenticated() && isAdmin() ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <div className="main-content">
            <Routes>
              {/* Default route redirects to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Public routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected route for the user dashboard */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              
              {/* Admin-only routes */}
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/manage-users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
              <Route path="/admin/manage-products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
              <Route path="/admin/manage-orders" element={<AdminRoute><ManageOrders /></AdminRoute>} /> {/* New Manage Orders route */}

              {/* Product list and product detail routes */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:productId" element={<ProductDetail />} />
              
              {/* Protected route for cart */}
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
