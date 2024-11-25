// models/Order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Tham chiếu đến mô hình Product
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    customerInfo: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        address: { type: String },
    },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
