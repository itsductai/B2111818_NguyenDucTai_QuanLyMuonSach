const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const database = require('./config/db.config');

// Import routes
const authRoutes = require('./routes/auth.route');
const sachRoutes = require('./routes/sach.route');

// Load biến môi trường
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối database
database.connect();

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Chào mừng đến với API Quản lý mượn sách.' });
});

// Sử dụng routes
app.use('/api/auth', authRoutes);
app.use('/api/sach', sachRoutes);

// Xử lý lỗi 404
app.use((req, res) => {
    res.status(404).json({ message: 'Không tìm thấy tài nguyên' });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Lỗi server' });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
}); 