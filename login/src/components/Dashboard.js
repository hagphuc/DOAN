// src/components/Dashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Đảm bảo đường dẫn đúng
import ProductList from './ProductList'; // Import component danh sách sản phẩm
import './Dashboard.css'; // Nếu bạn có file CSS riêng cho dashboard
import Cookies from 'js-cookie'; // Import thư viện để quản lý cookie

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token'); // Lấy token từ cookie
        if (!token) {
            navigate('/login'); // Nếu không có token, điều hướng đến trang đăng nhập
        }
    }, [navigate]);

    return (
        <div className="dashboard-container">
            {/* Header - ResponsiveAppBar */}
            <Header />

            {/* Nội dung chính của Dashboard */}
            <div className="dashboard-content">
                <h1>Dashboard</h1>
                {/* Hiển thị danh sách sản phẩm */}
                <ProductList />
            </div>
        </div>
    );
};

export default Dashboard;
