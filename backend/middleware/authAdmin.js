const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authAdmin = async (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;

        // Kiểm tra xem người dùng có phải là admin hay không
        const user = await User.findById(req.user);
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authAdmin;
