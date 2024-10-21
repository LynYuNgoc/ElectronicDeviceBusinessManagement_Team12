const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Thiết lập multer để lưu hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu hình ảnh
    },
    filename: (req, file, cb) => {
        // Tạo tên file duy nhất dựa trên thời gian hiện tại và phần mở rộng của tệp
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Khởi tạo multer với cấu hình đã thiết lập
const upload = multer({ storage: storage });

// Thêm sản phẩm
router.post('/add', upload.single('image'), async (req, res) => {
    console.log('Dữ liệu nhận được:', req.body); // Xem dữ liệu nhận được

    const { name, price, description, category } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !price || !description || !category || !req.file) {
        return res.status(400).json({ message: 'Thiếu thông tin sản phẩm.' });
    }

    try {
        // Tạo sản phẩm mới với thông tin đã nhận
        const newProduct = new Product({
            name,
            price,
            description,
            category,
            image: `/${req.file.path}` // Lưu đường dẫn hình ảnh
        });

        // Lưu sản phẩm vào MongoDB
        const savedProduct = await newProduct.save();
        console.log('Sản phẩm đã lưu:', savedProduct); // Xem sản phẩm đã lưu
        res.status(201).json(savedProduct); // Trả về sản phẩm đã lưu
    } catch (error) {
        console.error('Lỗi khi lưu sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const result = await Product.findByIdAndDelete(productId);
        if (!result) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
        }
        res.status(200).json({ message: 'Sản phẩm đã được xóa thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
});


// Lấy danh sách tất cả sản phẩm
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();  // Lấy tất cả sản phẩm từ MongoDB
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
    }
});

module.exports = router;
