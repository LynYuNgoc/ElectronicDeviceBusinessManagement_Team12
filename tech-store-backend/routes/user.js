const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// POST request để đăng ký người dùng
router.post('/signup', async (req, res) => {
    const { fullname, email, phone, password, address } = req.body;

    try {
        // Kiểm tra nếu email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({
            fullname,
            email,
            phone,
            password: hashedPassword,
            address,
        });

        // Lưu người dùng vào MongoDB
        await newUser.save();

        // Phản hồi với client
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error); // In ra lỗi chi tiết
        res.status(500).json({ message: 'Error registering user', error });
        console.log('Request body:', req.body); // Thêm dòng này để kiểm tra dữ liệu

    }
});

// POST request để đăng nhập người dùng
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại.' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác.' });
        }

        // Nếu xác thực thành công
        res.status(200).json({ message: 'Đăng nhập thành công!' });
    } catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình đăng nhập.', error });
    }
});


module.exports = router;
