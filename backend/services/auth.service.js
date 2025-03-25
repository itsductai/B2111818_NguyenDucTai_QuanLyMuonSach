const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const NhanVien = require('../models/NhanVien.model');

class AuthService {
    /**
     * Đăng nhập và tạo JWT token
     * @param {string} maNV - Mã nhân viên
     * @param {string} password - Mật khẩu
     * @returns {Object} Thông tin đăng nhập và token
     */
    async login(maNV, password) {
        // Tìm nhân viên theo mã
        const nhanVien = await NhanVien.findOne({ maNV });
        if (!nhanVien) {
            throw new Error('Mã nhân viên không tồn tại');
        }

        // Kiểm tra mật khẩu
        const isMatch = await nhanVien.comparePassword(password);
        if (!isMatch) {
            throw new Error('Mật khẩu không chính xác');
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: nhanVien._id, chucVu: nhanVien.chucVu },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            nhanVien: {
                id: nhanVien._id,
                maNV: nhanVien.maNV,
                hoTenNV: nhanVien.hoTenNV,
                chucVu: nhanVien.chucVu
            }
        };
    }

    /**
     * Đăng ký tài khoản nhân viên mới
     * @param {Object} nhanVienData - Thông tin nhân viên
     * @returns {Object} Thông tin nhân viên đã tạo
     */
    async register(nhanVienData) {
        // Kiểm tra mã nhân viên đã tồn tại
        const existingNhanVien = await NhanVien.findOne({ maNV: nhanVienData.maNV });
        if (existingNhanVien) {
            throw new Error('Mã nhân viên đã tồn tại');
        }

        // Tạo nhân viên mới
        const nhanVien = new NhanVien(nhanVienData);
        await nhanVien.save();

        return {
            id: nhanVien._id,
            maNV: nhanVien.maNV,
            hoTenNV: nhanVien.hoTenNV,
            chucVu: nhanVien.chucVu
        };
    }
}

module.exports = new AuthService(); 