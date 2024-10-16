const mongoose = require('mongoose');

// Định nghĩa Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String ,  required: true},
    category: { type: String, required: true },
    image: { type: String, required: true },  // Thêm thuộc tính image
    createdAt: { type: Date, default: Date.now }
});

// Tạo model Product từ schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
