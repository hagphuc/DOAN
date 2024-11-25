const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authAdmin = async (req, res, next) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.header('Authorization');
        
        // Kiểm tra xem header có tồn tại và có đúng định dạng không
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Tách token ra từ chuỗi "Bearer <token>"
        const token = authHeader.split(' ')[1];

        // Giải mã token để lấy user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId; // Gán user ID cho req.user

        // Tìm kiếm user trong cơ sở dữ liệu và bỏ qua trường password
        const user = await User.findById(req.user).select('-password'); 

        // Kiểm tra xem user có tồn tại và có vai trò admin không
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied, admin only' });
        }

        // Nếu là admin, cho phép tiếp tục
        next();
    } catch (err) {
        console.error(err);
        // Kiểm tra lỗi JWT
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        }
        // Xử lý các lỗi khác
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = authAdmin;
