// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from './ProductList';
import './Dashboard.css';
import Cookies from 'js-cookie';
import Header from './Header';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Icon mũi tên đi lên từ MUI
import { Fab, Box } from '@mui/material'; // Nút tròn từ MUI
import Slider from 'react-slick'; // Thêm thư viện carousel

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

    const settings = {
        dots: false, // Tắt dấu chấm
        infinite: true, // Bật chế độ vòng lặp
        speed: 500, // Thời gian chuyển đổi giữa các banner
        slidesToShow: 1, // Hiển thị 1 banner cùng lúc
        slidesToScroll: 1, // Chuyển động 1 banner tại một thời điểm
        autoplay: true, // Tự động chuyển
        autoplaySpeed: 3000, // Thời gian chuyển mỗi slide (3 giây)
        arrows: false, // Tắt các nút Next/Previous
        swipeToSlide: true, // Cho phép người dùng vuốt chuyển slide
        centerMode: false, // Tắt chế độ trung tâm nếu không cần
        pauseOnHover: true, // Tạm dừng khi hover vào slider
    };
    return (
        <div className="dashboard-container">
            <Header />
            
            {/* Banner quảng cáo sản phẩm */}
            <Box sx={{ width: '100%', marginTop: 2 }}>
                <Slider {...settings}>
                    <div>
                        <img 
                            src="/banner1.png" 
                            alt="Sale Banner 1" 
                            className="carousel-img" 
                        />
                    </div>
                    <div>
                        <img 
                            src="/banner2.png" 
                            alt="Sale Banner 2" 
                            className="carousel-img"
                        />
                    </div>
                    <div>
                        <img 
                            src="/banner4.jpg" 
                            alt="Sale Banner 3" 
                            className="carousel-img"
                        />
                    </div>
                    <div>
                        <img 
                            src="/banner5.jpg" 
                            alt="Sale Banner 4" 
                            className="carousel-img"
                        />
                    </div>
                    <div>
                        <img 
                            src="/banner6.png" 
                            alt="Sale Banner 5" 
                            className="carousel-img"
                        />
                    </div>
                    <div>
                        <img 
                            src="/banner3.jpg" 
                            alt="Sale Banner 6" 
                            className="carousel-img"
                        />
                    </div>
                </Slider>
            </Box>

            <div className="dashboard-content">
                <h1>Danh sách sản phẩm</h1>
                <ProductList />
            </div>

            {/* Nút mũi tên đi lên */}
            {showScrollTop && (
                <Fab
                    color="default"
                    onClick={scrollToTop}
                    className="scroll-to-top"
                    aria-label="scroll to top"
                    sx={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: 'white',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: '#f0f0f0'
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