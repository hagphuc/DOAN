// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Thêm danh sách sản phẩm tham chiếu
}, {
    timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);
