const jwt = require('jsonwebtoken');
const NhanVien = require('../models/NhanVien.model');

/**
 * Middleware xác thực JWT token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const verifyToken = async (req, res, next) => {
    try {
        // Lấy token từ header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Không tìm thấy token xác thực'
            });
        }

        const token = authHeader.split(' ')[1];

        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra nhân viên có tồn tại
        const nhanVien = await NhanVien.findById(decoded.id);
        if (!nhanVien) {
            return res.status(401).json({
                message: 'Token không hợp lệ hoặc nhân viên không tồn tại'
            });
        }

        // Thêm thông tin nhân viên vào request
        req.nhanVien = nhanVien;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

/**
 * Middleware kiểm tra quyền Admin
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const isAdmin = (req, res, next) => {
    if (req.nhanVien && req.nhanVien.chucVu === 'Admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'Không có quyền truy cập. Yêu cầu quyền Admin'
        });
    }
};

module.exports = {
    verifyToken,
    isAdmin
}; 