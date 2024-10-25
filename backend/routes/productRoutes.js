// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authAdmin = require('../middleware/authAdmin');
const upload = require('../middleware/upload'); // Import middleware upload

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => { // Xóa middleware authAdmin
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi máy chủ' });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy một sản phẩm bằng ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authAdmin,async (req, res) => { // Xóa middleware authAdmin
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Sản phẩm không tìm thấy' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi máy chủ' });
    }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Thêm một sản phẩm mới
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       500:
 *         description: Server error
 */
router.post('/', authAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const imageUrl = req.file ? `uploads/${req.file.filename}` : ''; // Sử dụng đường dẫn tương đối

        const newProduct = new Product({
            name,
            description,
            price,
            imageUrl // Lưu đường dẫn hình ảnh vào cơ sở dữ liệu
        });

        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Cập nhật một sản phẩm bằng ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const imageUrl = req.file ? req.file.path : undefined; // Lấy đường dẫn hình ảnh (có thể là undefined nếu không có hình ảnh)

        const updateData = {
            name,
            description,
            price,
            ...(imageUrl && { imageUrl }) // Chỉ cập nhật imageUrl nếu nó có giá trị
        };

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ msg: 'Sản phẩm không tìm thấy' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Xoá một sản phẩm bằng ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authAdmin, async (req, res) => {
    try {
        console.log('Đang cố gắng xóa sản phẩm với ID:', req.params.id); // Log ID
        const product = await Product.findByIdAndDelete(req.params.id); // Sử dụng findByIdAndDelete
        
        if (!product) {
            return res.status(404).json({ msg: 'Sản phẩm không tìm thấy' });
        }

        console.log('Sản phẩm đã được xóa thành công'); // Log khi xóa thành công
        res.json({ msg: 'Sản phẩm đã được xóa thành công' });
    } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err); // Log lỗi chi tiết
        res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message }); // Trả về thông tin lỗi
    }
});
module.exports = router;
