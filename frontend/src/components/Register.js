import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Nhập Link từ react-router-dom
import './register.css'; // Đảm bảo bạn có file CSS này

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); // Trạng thái để lưu lỗi cho từng trường
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false); // Trạng thái để hiển thị thông báo

    const navigate = useNavigate(); // Khởi tạo useNavigate

    const validateForm = () => {
        const formErrors = {};

        // Kiểm tra từng trường và tạo lỗi tương ứng
        if (!username) formErrors.username = 'Vui lòng nhập tên người dùng.';
        if (!email) formErrors.email = 'Vui lòng nhập email.';
        if (!password) formErrors.password = 'Vui lòng nhập mật khẩu.';

        return formErrors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {  
                username,
                email,
                password
            });
            console.log(response.data);
            setMessage(response.data.msg); // Hiển thị thông báo đăng ký thành công
            setShowMessage(true);

            // Chuyển hướng đến trang đăng nhập sau 5 giây
            setTimeout(() => {
                navigate('/login'); // Thay '/login' bằng đường dẫn đến trang đăng nhập của bạn
            }, 2000);
        } catch (error) {
            console.error(error);
            if (error.response) {
                setMessage(error.response.data.msg || 'Đăng ký thất bại.');
            } else {
                setMessage('Đăng ký thất bại, vui lòng thử lại sau.');
            }
            setShowMessage(true);

            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
        }
    };

    return (
        <div className="register-container">
            <h1>Đăng Ký</h1>
            <form onSubmit={handleRegister} className="register-form">
                <div className="form-group">
                    <label>Tên người dùng:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <p className="error-message">{errors.username}</p>} {/* Hiển thị lỗi nếu có */}
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>} {/* Hiển thị lỗi nếu có */}
                </div>
                <div className="form-group">
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>} {/* Hiển thị lỗi nếu có */}
                </div>
                <button type="submit" className="register-button">Đăng Ký</button>
            </form>
            
            {showMessage && (
                <div className="message-container">
                    <p className="message">{message}</p>
                </div>
            )}

            <div className="login-redirect">
                <p>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
            </div>
        </div>
    );
};

export default Register;
