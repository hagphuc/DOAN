// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from './ProductList';
import './Dashboard.css';
import Cookies from 'js-cookie';
import Header from './Header';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Icon mũi tên đi lên từ MUI
import { Fab } from '@mui/material'; // Nút tròn từ MUI

const Dashboard = () => {
    const navigate = useNavigate();
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    // Hàm kiểm tra vị trí cuộn và hiển thị nút lên đầu trang
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300); // Hiển thị nút khi cuộn xuống hơn 300px
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hàm cuộn lên đầu trang
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="dashboard-container">
            <Header />
            <div className="dashboard-content">
                <h1>Danh sách sản phẩm</h1>
                <ProductList />
            </div>

            {/* Nút mũi tên đi lên */}
            {showScrollTop && (
                <Fab
                    color="default"  // Giữ màu icon mặc định hoặc có thể dùng "primary" nếu muốn màu khác
                    onClick={scrollToTop}
                    className="scroll-to-top"
                    aria-label="scroll to top"
                    sx={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: 'white', // Màu nền trắng
                        color: 'black', // Màu icon đen (có thể thay đổi)
                        '&:hover': {
                            backgroundColor: '#f0f0f0' // Màu nền khi hover
                        }
                    }}
                >
                    <ArrowUpwardIcon />
                </Fab>
            )}

        </div>
    );
};

export default Dashboard;
