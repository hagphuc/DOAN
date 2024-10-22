import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Nhập Link để tạo liên kết
import './Login.css'; // Đảm bảo bạn có file CSS này

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            setMessage(response.data.msg);
            // Nếu đăng nhập thành công, chuyển hướng tới trang chủ hoặc dashboard
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.response?.data?.msg || 'Đăng nhập thất bại.');
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng Nhập</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Đăng Nhập</button>
            </form>
            {message && <p>{message}</p>} {/* Hiển thị thông báo */}
            
            {/* Phần đăng ký bên dưới form đăng nhập */}
            <div className="register-link">
                <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
            </div>
        </div>
    );
};

export default Login;
