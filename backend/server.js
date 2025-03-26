const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load biến môi trường
dotenv.config();

// Import routes
const sachRoute = require('./routes/sach.route');
const nhaXuatBanRoute = require('./routes/nhaxuatban.route');
const docGiaRoute = require('./routes/docgia.route');
const nhanVienRoute = require('./routes/nhanvien.route');
const theoDoiMuonSachRoute = require('./routes/theodoimuonsach.route');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quanlymuonsach')
    .then(() => console.log('Kết nối database thành công'))
    .catch(err => console.error('Lỗi kết nối database:', err));

// Routes
app.use('/api/sach', sachRoute);
app.use('/api/nha-xuat-ban', nhaXuatBanRoute);
app.use('/api/nhaxuatban', nhaXuatBanRoute);
app.use('/api/doc-gia', docGiaRoute);
app.use('/api/nhan-vien', nhanVienRoute);
app.use('/api/muon-sach', theoDoiMuonSachRoute);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Có lỗi xảy ra',
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
}); 