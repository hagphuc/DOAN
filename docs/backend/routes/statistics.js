const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

const router = express.Router();

/**
 * @swagger
 * /api/statistics:
 *   get:
 *     summary: Get statistics (users, products, orders, categories)
 *     description: This endpoint returns the count of users, products, orders, and categories.
 *     responses:
 *       200:
 *         description: Successfully retrieved statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: integer
 *                 products:
 *                   type: integer
 *                 orders:
 *                   type: integer
 *                 categories:
 *                   type: integer
 */
router.get('/statistics', async (req, res) => {
  try {
    // Lấy số lượng người dùng
    const userCount = await User.countDocuments();
    // Lấy số lượng sản phẩm
    const productCount = await Product.countDocuments();
    // Lấy số lượng đơn hàng
    const orderCount = await Order.countDocuments();
    // Lấy số lượng danh mục
    const categoryCount = await Category.countDocuments();

    // Trả về kết quả thống kê
    res.json({
      users: userCount,
      products: productCount,
      orders: orderCount,
      categories: categoryCount,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

module.exports = router;
