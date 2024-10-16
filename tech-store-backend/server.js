const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/productRoutes');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/TechStore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/products', productRoutes);

// Đảm bảo server phục vụ tệp tĩnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.delete('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        // Giả sử bạn sử dụng Mongoose để xóa người dùng
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }
        res.status(200).json({ message: 'Người dùng đã được xóa thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
});


// Routes
app.use('/api/users', userRoutes);

// Bắt đầu máy chủ
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
