const NhanVien = require('../models/NhanVien.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class NhanVienController {
    /**
     * Đăng nhập
     * @route POST /api/nhan-vien/login
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Kiểm tra email
            const nhanVien = await NhanVien.findOne({ email });
            if (!nhanVien) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            // Kiểm tra mật khẩu
            const isMatch = await nhanVien.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            // Tạo token chỉ với id và chức vụ
            const token = jwt.sign(
                { 
                    id: nhanVien._id,
                    type: nhanVien.chucVu
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Trả về thông tin
            res.json({
                token,
                user: {
                    id: nhanVien._id,
                    maNV: nhanVien.maNV,
                    hoTenNV: nhanVien.hoTenNV,
                    chucVu: nhanVien.chucVu,
                    email: nhanVien.email
                }
            });
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /**
     * Lấy danh sách nhân viên
     * @route GET /api/nhan-vien
     */
    async getAll(req, res) {
        try {
            const nhanVien = await NhanVien.find()
                .select('-password')
                .sort({ createdAt: -1 });
            res.json(nhanVien);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách nhân viên:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /**
     * Lấy thông tin một nhân viên
     * @route GET /api/nhan-vien/:id
     */
    async getById(req, res) {
        try {
            const nhanVien = await NhanVien.findById(req.params.id)
                .select('-password');
            if (!nhanVien) {
                return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
            }
            res.json(nhanVien);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin nhân viên:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /**
     * Thêm nhân viên mới
     * @route POST /api/nhan-vien
     */
    async create(req, res) {
        try {
            const nhanVien = new NhanVien(req.body);
            await nhanVien.save();
            res.status(201).json({
                message: 'Thêm nhân viên thành công',
                nhanVien: {
                    id: nhanVien._id,
                    maNV: nhanVien.maNV,
                    hoTenNV: nhanVien.hoTenNV,
                    chucVu: nhanVien.chucVu,
                    email: nhanVien.email
                }
            });
        } catch (error) {
            console.error('Lỗi khi thêm nhân viên:', error);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /**
     * Cập nhật thông tin nhân viên
     * @route PUT /api/nhan-vien/:id
     */
    async update(req, res) {
        try {
            const nhanVien = await NhanVien.findById(req.params.id);
            if (!nhanVien) {
                return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
            }

            // Cập nhật thông tin
            Object.assign(nhanVien, req.body);
            await nhanVien.save();

            res.json({
                message: 'Cập nhật thành công',
                nhanVien: {
                    id: nhanVien._id,
                    maNV: nhanVien.maNV,
                    hoTenNV: nhanVien.hoTenNV,
                    chucVu: nhanVien.chucVu,
                    email: nhanVien.email
                }
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật nhân viên:', error);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /**
     * Xóa nhân viên
     * @route DELETE /api/nhan-vien/:id
     */
    async delete(req, res) {
        try {
            const nhanVien = await NhanVien.findByIdAndDelete(req.params.id);
            if (!nhanVien) {
                return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
            }
            res.json({ message: 'Xóa nhân viên thành công' });
        } catch (error) {
            console.error('Lỗi khi xóa nhân viên:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
}

module.exports = new NhanVienController(); 