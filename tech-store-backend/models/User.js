const mongoose = require('mongoose');

// Định nghĩa cấu trúc cho người dùng
const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    resetPasswordToken: { type: String, default: null }, // Thêm trường cho token reset password
    resetPasswordExpires: { type: Date, default: null }, // Thêm trường cho thời gian hết hạn của token
    status: { type: Boolean, default: true }, // Thêm trường cho trạng thái người dùng (hoạt động/vô hiệu hóa)
});

// Tạo mô hình User từ schema
const User = mongoose.model('User', userSchema);

// Xuất mô hình User để sử dụng ở nơi khác
module.exports = User;
