// Footer.js
import React from 'react';
import './Footer.css'; // Import CSS cho footer

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-info">
                    <h3>Flower Paradise</h3>
                    <p>Chúng tôi cung cấp các loại hoa tươi đẹp nhất cho mọi dịp.</p>
                    <p>&copy; 2024 Flower Paradise. All rights reserved.</p>
                </div>
                <div className="footer-services">
                    <h4>Dịch vụ</h4>
                    <ul>
                        <li><a href="#!">Giao hàng tận nơi</a></li>
                        <li><a href="#!">Đặt hàng online</a></li>
                        <li><a href="#!">Dịch vụ hoa cưới</a></li>
                        <li><a href="#!">Tư vấn hoa trang trí</a></li>
                    </ul>
                </div>
                <div className="footer-social">
                    <h4>Theo dõi chúng tôi</h4>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                            <img src="/icon-fb.png" alt="Facebook" />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                            <img src="/icon-instagram.png" alt="Instagram" />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
                        <img src="/icon-twitter.png" alt="Instagram" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
