const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Thư viện để tạo token reset
const nodemailer = require('nodemailer'); // Để gửi email

// POST request để đăng ký người dùng
router.post('/signup', async (req, res) => {
    const { fullname, email, phone, password, address } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullname,
            email,
            phone,
            password: hashedPassword,
            address,
        });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error('Lỗi trong quá trình đăng ký:', error);
        res.status(500).json({ message: 'Đăng ký thất bại', error });
    }
});

// POST request để đăng nhập người dùng
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại.' });
        }

        // Kiểm tra trạng thái tài khoản
        if (!user.status) {
            return res.status(403).json({ message: 'Tài khoản của bạn đã bị vô hiệu hóa.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác.' });
        }

        res.status(200).json({ message: 'Đăng nhập thành công!' });
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi trong quá trình đăng nhập', error });
    }
});

// GET request để lấy danh sách người dùng
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error });
    }
});

// API lấy thông tin người dùng dựa vào email
app.get('/api/user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email: email }); // Tìm người dùng qua email
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user); // Trả về thông tin người dùng
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
});


// DELETE request để xóa người dùng
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }
        res.status(200).json({ message: 'Người dùng đã được xóa thành công.' });
    } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xóa người dùng.', error });
    }
});

// PATCH request để vô hiệu hóa người dùng
router.patch('/users/disable/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndUpdate(id, { status: false }); // Giả sử bạn có trường status
        res.status(200).json({ message: 'Người dùng đã được vô hiệu hóa.' });
    } catch (error) {
        console.error('Lỗi khi vô hiệu hóa người dùng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi vô hiệu hóa người dùng.', error });
    }
});

module.exports = router;
