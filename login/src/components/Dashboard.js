// src/components/Dashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from './ProductList'; // Import component danh sách sản phẩm
import './Dashboard.css'; // Nếu bạn có file CSS riêng cho dashboard
import Cookies from 'js-cookie'; // Import thư viện để quản lý cookie
import Header from './Header'; // Import component Header

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
            <Header />
            {/* Nội dung chính của Dashboard */}
            <div className="dashboard-content">
                <h1>Danh sách sản phẩm</h1>
                {/* Hiển thị danh sách sản phẩm */}
                <ProductList />
            </div>
        </div>
    );
};

export default Dashboard;
