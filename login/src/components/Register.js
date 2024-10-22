import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Nhập useNavigate từ react-router-dom
import './register.css'; // Đảm bảo bạn có file CSS này

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false); // Trạng thái để hiển thị thông báo

    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleRegister = async (e) => {
        e.preventDefault();

        // Kiểm tra xem tất cả các trường đã được điền chưa
        if (!username || !email || !password) {
            setMessage('Vui lòng điền đầy đủ thông tin.');
            setShowMessage(true);
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {  // Chú ý URL đầy đủ
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
            <h2>Đăng Ký</h2>
            <form onSubmit={handleRegister} className="register-form">
                <div className="form-group">
                    <label>Tên người dùng:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit" className="register-button">Đăng Ký</button>
            </form>
            {showMessage && (
                <div className="message-container">
                    <p className="message">{message}</p>
                </div>
            )}
        </div>
    );
};

export default Register;
