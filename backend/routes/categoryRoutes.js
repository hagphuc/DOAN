// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authAdmin = require('../middleware/authAdmin');
const Product = require('../models/Product');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách thư mục và các sản phẩm trong từng thư mục
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories with their products
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();

        const categoriesWithProducts = await Promise.all(categories.map(async (category) => {
            const products = await Product.find({ category: category._id }); // Lấy sản phẩm theo ID danh mục
            return {
                ...category._doc,
                products
            };
        }));

        res.json(categoriesWithProducts);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message });
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy một thư mục bằng ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single category
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Thư mục không tìm thấy' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi máy chủ' });
    }
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Thêm một thư mục mới
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       500:
 *         description: Server error
 */
router.post('/', authAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });
        const category = await newCategory.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message });
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Cập nhật một thư mục bằng ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ msg: 'Thư mục không tìm thấy' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message });
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Xoá một thư mục bằng ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category removed successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authAdmin, async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Thư mục không tìm thấy' });
        }
        res.json({ msg: 'Thư mục đã được xóa thành công' });
    } catch (err) {
        res.status(500).json({ msg: 'Lỗi máy chủ', error: err.message });
    }
});


module.exports = router;
