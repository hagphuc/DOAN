// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String }, // Thêm trường imageUrl
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Giả định rằng bạn đã có mô hình Category với tên 'Category'
        required: true,
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
