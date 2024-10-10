const mongoose = require('mongoose');

// Định nghĩa cấu trúc cho người dùng
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
});

// Tạo mô hình User từ schema
const User = mongoose.model('User', userSchema);

// Xuất mô hình User để sử dụng ở nơi khác
module.exports = User;
