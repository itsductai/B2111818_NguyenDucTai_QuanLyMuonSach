const DocGia = require('../models/DocGia.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class DocGiaController {
    /**
     * Lấy danh sách độc giả
     * @route GET /api/doc-gia
     */
    async getAll(req, res) {
        try {
            const docGia = await DocGia.find()
                .select('-matKhau')
                .sort({ createdAt: -1 });
            res.json(docGia);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách độc giả:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /**
     * Lấy thông tin một độc giả
     * @route GET /api/doc-gia/:id
     */
    async getById(req, res) {
        try {
            const docGia = await DocGia.findById(req.params.id)
                .select('-matKhau');
            if (!docGia) {
                return res.status(404).json({ message: 'Không tìm thấy độc giả' });
            }

            // Kiểm tra quyền truy cập
            if (req.user.type === 'DocGia' && req.user.id !== docGia.id) {
                return res.status(403).json({ message: 'Không có quyền truy cập' });
            }

            res.json(docGia);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin độc giả:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /**
     * Thêm độc giả mới
     * @route POST /api/doc-gia
     */
    async create(req, res) {
        try {
            const docGia = new DocGia(req.body);
            await docGia.save();
            res.status(201).json({
                message: 'Thêm độc giả thành công',
                docGia: {
                    id: docGia._id,
                    maDocGia: docGia.maDocGia,
                    hoLot: docGia.hoLot,
                    ten: docGia.ten,
                    email: docGia.email
                }
            });
        } catch (error) {
            console.error('Lỗi khi thêm độc giả:', error);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /**
     * Cập nhật thông tin độc giả
     * @route PUT /api/doc-gia/:id
     */
    async update(req, res) {
        try {
            const docGia = await DocGia.findById(req.params.id);
            if (!docGia) {
                return res.status(404).json({ message: 'Không tìm thấy độc giả' });
            }

            // Kiểm tra quyền cập nhật
            if (req.user.type === 'DocGia' && req.user.id !== docGia.id) {
                return res.status(403).json({ message: 'Không có quyền cập nhật' });
            }

            // Cập nhật thông tin
            Object.assign(docGia, req.body);
            await docGia.save();

            res.json({
                message: 'Cập nhật thành công',
                docGia: {
                    id: docGia._id,
                    maDocGia: docGia.maDocGia,
                    hoLot: docGia.hoLot,
                    ten: docGia.ten,
                    email: docGia.email
                }
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật độc giả:', error);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /**
     * Xóa độc giả
     * @route DELETE /api/doc-gia/:id
     */
    async delete(req, res) {
        try {
            const docGia = await DocGia.findByIdAndDelete(req.params.id);
            if (!docGia) {
                return res.status(404).json({ message: 'Không tìm thấy độc giả' });
            }
            res.json({ message: 'Xóa độc giả thành công' });
        } catch (error) {
            console.error('Lỗi khi xóa độc giả:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /**
     * Đăng nhập
     * @route POST /api/doc-gia/login
     */
    async login(req, res) {
        try {
            const { email, matKhau } = req.body;

            // Kiểm tra email
            const docGia = await DocGia.findOne({ email });
            if (!docGia) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            // Kiểm tra mật khẩu
            const isMatch = await docGia.comparePassword(matKhau);
            if (!isMatch) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            // Tạo token chỉ với id và type là DocGia
            const token = jwt.sign(
                { 
                    id: docGia._id,
                    type: 'DocGia'
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Trả về thông tin
            res.json({
                token,
                user: {
                    id: docGia._id,
                    maDocGia: docGia.maDocGia,
                    hoLot: docGia.hoLot,
                    ten: docGia.ten,
                    email: docGia.email
                }
            });
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
}

module.exports = new DocGiaController(); 