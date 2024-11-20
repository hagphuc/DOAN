import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Nhập thư viện js-cookie
import './Login.css'; // Đảm bảo có file CSS này

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        // Kiểm tra xem các trường có bị bỏ trống không
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
    
        setLoading(true); // Bắt đầu loading khi nhấn đăng nhập
    
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            const { token, role, username } = response.data; // Lấy token, role và username
    
            // Lưu trữ token và role trong localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role); // Lưu trữ vai trò
            localStorage.setItem('username', username); // Lưu trữ username vào localStorage
    
            // Lưu trữ cookie cho token (có thể thêm ngày hết hạn)
            Cookies.set('token', token, { expires: 7 });
            Cookies.set('role', role, { expires: 7 });
    
            setError(''); // Xóa thông báo lỗi nếu đăng nhập thành công
            setLoading(false); // Dừng loading khi đăng nhập thành công
    
            // Điều hướng dựa trên vai trò của người dùng
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            setLoading(false); // Dừng loading khi có lỗi
            const errorMessage = error.response?.data?.msg || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
            setError(errorMessage);
        }
    };
    
    return (
        <div className="login-container">
            <h1>Đăng Nhập</h1>
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

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                </button>
            </form>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <p className="error-message">{error}</p>}

            <div className="register-link">
                <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
            </div>
        </div>
    );
};

export default Login;
