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


// POST request để gửi email quên mật khẩu
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại.' });
        }

        // Tạo token reset mật khẩu
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; // Token có hiệu lực trong 1 giờ

        // Lưu token vào người dùng
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiration;
        await user.save();

        // Gửi email đặt lại mật khẩu
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'youremail@gmail.com', // Địa chỉ email của bạn
                pass: 'yourpassword',        // Mật khẩu email của bạn
            },
        });

        const mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you have requested a password reset for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   ${resetLink}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Lỗi khi gửi email.', error });
            } else {
                res.status(200).json({ message: 'Đã gửi liên kết đặt lại mật khẩu đến email của bạn.' });
            }
        });
    } catch (error) {
        console.error('Lỗi khi yêu cầu đặt lại mật khẩu:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra.', error });
    }
});

// POST request để đặt lại mật khẩu
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;

    try {
        // Tìm người dùng có token và kiểm tra thời gian hết hạn của token
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }, // Token phải chưa hết hạn
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }

        // Cập nhật mật khẩu mới và xóa token
        user.password = await bcrypt.hash(password, 10); // Mã hóa mật khẩu mới
        user.resetPasswordToken = undefined; // Xóa token sau khi sử dụng
        user.resetPasswordExpires = undefined; // Xóa thời gian hết hạn của token

        await user.save(); // Lưu người dùng sau khi cập nhật mật khẩu

        res.status(200).json({ message: 'Mật khẩu của bạn đã được đặt lại thành công.' });
    } catch (error) {
        console.error('Lỗi khi đặt lại mật khẩu:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra trong quá trình đặt lại mật khẩu.', error });
    }
});


module.exports = router;
