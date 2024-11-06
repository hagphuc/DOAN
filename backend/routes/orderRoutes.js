// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Thêm đơn hàng mới
  *     tags: [Orders]

 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               totalAmount:
 *                 type: number
 *               customerInfo:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                   address:
 *                     type: string
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       500:
 *         description: Failed to place order
 */
router.post('/', async (req, res) => {
    const { items, totalAmount, customerInfo } = req.body;
    try {
        const order = new Order({
            items,
            totalAmount,
            customerInfo,
        });
        await order.save();
        res.status(201).json({ success: true, message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Failed to place order' });
    }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng
   *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders
 *       500:
 *         description: Failed to retrieve orders
 */
router.get('/', async (req, res) => {
    try {
        // Populate các trường productId để lấy thêm tên sản phẩm, mã sản phẩm và giá
        const orders = await Order.find().populate('items.productId', 'name price'); // Giả sử bạn có các trường `name` và `price` trong mô hình Product
        res.json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
        res.status(500).json({ success: false, message: 'Không thể lấy đơn hàng' });
    }
});

/**
 * @swagger
 * /api/orders/{orderId}:
 *   delete:
 *     summary: Xóa đơn hàng theo ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID của đơn hàng cần xóa
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đơn hàng đã được xóa thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi khi xóa đơn hàng
 */
router.delete('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
        // Tìm và xóa đơn hàng theo ID
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        res.status(200).json({ success: true, message: 'Đơn hàng đã được xóa thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error);
        res.status(500).json({ success: false, message: 'Lỗi khi xóa đơn hàng' });
    }
});

module.exports = router;
