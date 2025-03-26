const jwt = require('jsonwebtoken');
const NhanVien = require('../models/NhanVien.model');
const DocGia = require('../models/DocGia.model');

// Middleware xác thực token
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
    if (req.user.type !== 'Admin') {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
};

// Middleware kiểm tra quyền Nhân viên hoặc Admin
const isStaff = (req, res, next) => {
    if (req.user.type !== 'Admin' && req.user.type !== 'Nhân viên') {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
};

// Middleware kiểm tra quyền Độc giả
const isReader = (req, res, next) => {
    if (req.user.type !== 'DocGia') {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        }
        next();
    };
};

module.exports = {
    auth,
    isAdmin,
    isStaff,
    isReader,
    checkRole
}; 