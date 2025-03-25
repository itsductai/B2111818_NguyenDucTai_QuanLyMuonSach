const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const database = require('./config/db.config');

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
    res.json({ message: 'Welcome to QuanLyMuonSach API.' });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
}); 