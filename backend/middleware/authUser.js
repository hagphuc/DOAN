const jwt = require('jsonwebtoken');

const authUser = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Lấy token từ header
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        req.user = decoded;  // Gán thông tin user từ token vào request
        next(); // Cho phép tiếp tục
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authUser;
