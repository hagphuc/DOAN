const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const authAdmin = require('../middleware/authAdmin');

// @swagger /api/auth/register
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký User
 *     description: Create a new user in the system
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: 'Vai trò của người dùng, có thể là "user" hoặc "admin". Mặc định là "user".'
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Error in registering the user
 */

// Đăng ký người dùng
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Kiểm tra nếu username đã tồn tại
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'Username đã được sử dụng' });

        // Kiểm tra nếu email đã tồn tại
        user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Email đã được sử dụng' });

        // Kiểm tra vai trò có hợp lệ hay không
        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({ msg: 'Role is invalid. Choose either "user" or "admin"' });
        }

        // Mã hóa mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Tạo user mới
        user = new User({ username, email, password: hashedPassword, role: role || 'user' });
        await user.save();
        
        res.status(201).json({ msg: 'Đăng ký tài khoản thành công!' });
    } catch (err) {
        console.error('Server error:', err);  // Log lỗi để kiểm tra
        res.status(500).json({ msg: 'Server error' });
    }
});


// @swagger /api/auth/login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập User
 *     description: Authenticate user and return a JWT token
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Tạo token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


// @swagger /api/auth/delete/{id}
/**
 * @swagger
 * /api/auth/delete/{id}:
 *   delete:
 *     summary: Xoá User
 *     description: Admin can delete users
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Xóa người dùng (chỉ dành cho quản trị viên)
router.delete('/delete/:id', authAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Sử dụng findByIdAndDelete để xóa người dùng
        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err); // Log lỗi để kiểm tra
        res.status(500).json({ msg: 'Server error' });
    }
});

// @swagger /api/auth/users
/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Lấy danh sách User
 *     description: Chỉ dành cho quản trị viên
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi máy chủ
 */
// @swagger /api/auth/users
router.get('/users', authAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @swagger /api/auth/user/{id}
/**
 * @swagger
 * /api/auth/user/{id}:
 *   get:
 *     summary: Lấy thông tin User theo ID
 *     description: Admin có thể lấy thông tin người dùng theo ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của người dùng cần lấy thông tin
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/user/:id', authAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
