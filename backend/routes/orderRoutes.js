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
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
    }
});

module.exports = router;
