// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authAdmin = require('../middleware/authAdmin');
const upload = require('../middleware/upload'); // Import middleware upload
const authUser = require('../middleware/authUser');
const fs = require('fs');
const path = require('path');
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
// Route lấy danh sách sản phẩm - Yêu cầu người dùng đăng nhập
router.get('/', authUser, async (req, res) => {
    try {
        const products = await Product.find().populate('category'); // Sử dụng populate để lấy thông tin category
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
// Route lấy sản phẩm theo ID - Yêu cầu người dùng đăng nhập
router.get('/:id', authUser, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category'); // Sử dụng populate để lấy thông tin category
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
 *               category:
 *                 type: string
 *                 description: ID của category
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
        const { name, description, price, category } = req.body;
        const imageUrl = req.file ? `uploads/${req.file.filename}` : ''; // Sử dụng đường dẫn tương đối

        const newProduct = new Product({
            name,
            description,
            price,
            category, // Lưu category
            imageUrl, // Lưu đường dẫn hình ảnh vào cơ sở dữ liệu
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
 *               category:
 *                 type: string
 *                 description: ID của category
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
        const { name, description, price, category } = req.body;
        const imageUrl = req.file ? req.file.path : undefined; // Lấy đường dẫn hình ảnh (có thể là undefined nếu không có hình ảnh)
        const updateData = {
            name,
            description,
            price,
            category, // Thêm category vào bản cập nhật
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
// Route xóa sản phẩm theo ID - Yêu cầu người dùng đăng nhập
router.delete('/:id', authAdmin, async (req, res) => {
    try {
        // Tìm sản phẩm theo ID
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Sản phẩm không tìm thấy' });
        }
        // Đường dẫn ảnh từ database (phải là đường dẫn tương đối từ 'uploads')
        const relativeImagePath = product.imageUrl;
        // Kiểm tra nếu có đường dẫn ảnh trong sản phẩm
        if (relativeImagePath) {
            // Tạo đường dẫn tuyệt đối đến ảnh dựa trên cấu trúc "backend/uploads"
            const absoluteImagePath = path.resolve(__dirname, '..', relativeImagePath);
            // In ra console đường dẫn ảnh để kiểm tra
            console.log('Đường dẫn ảnh tuyệt đối:', absoluteImagePath);
            // Kiểm tra nếu ảnh tồn tại
            if (fs.existsSync(absoluteImagePath)) {
                // Ảnh tồn tại, tiến hành xóa
                fs.unlink(absoluteImagePath, (err) => {
                    if (err) {
                        console.error('Lỗi khi xóa ảnh:', err); // Log lỗi nếu việc xóa thất bại
                        return res.status(500).json({ msg: 'Lỗi khi xóa ảnh', error: err.message });
                    } else {
                        console.log('Ảnh đã được xóa thành công');
                    }
                });
            } else {
                console.log('Ảnh không tồn tại tại đường dẫn:', absoluteImagePath); // Log nếu ảnh không tồn tại
            }
        }
        // Xóa sản phẩm khỏi cơ sở dữ liệu
        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Sản phẩm đã được xóa thành công' });
    } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err);
        res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message });
    }
});
module.exports = router;
