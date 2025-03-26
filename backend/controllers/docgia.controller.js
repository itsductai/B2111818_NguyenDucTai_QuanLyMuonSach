const DocGia = require('../models/DocGia.model');
const bcrypt = require('bcryptjs');

// Đăng ký độc giả mới
exports.register = async (req, res) => {
    try {
        const docGia = new DocGia(req.body);
        const newDocGia = await docGia.save();

        res.status(201).json({
            message: 'Đăng ký tài khoản thành công',
            docGia: {
                 _id: newDocGia._id,
                maDocGia: newDocGia.maDocGia,
                hoLot: newDocGia.hoLot,
                ten: newDocGia.ten,
                email: newDocGia.email,
                trangThai: newDocGia.trangThai
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Đăng nhập độc giả
exports.login = async (req, res) => {
    try {
        const { email, matKhau } = req.body;
        const docGia = await DocGia.findOne({ email });

        if (!docGia) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await docGia.comparePassword(matKhau);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        if (docGia.trangThai === 'Bị khóa') {
            return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
        }


        res.json({
            message: 'Đăng nhập thành công',
            docGia: {
                _id: docGia._id,
                maDocGia: docGia.maDocGia,
                hoLot: docGia.hoLot,
                ten: docGia.ten,
                email: docGia.email,
                trangThai: docGia.trangThai,
                ngayDangKy: docGia.ngayDangKy
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách độc giả
exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const docGia = await DocGia.find()
            .select('-matKhau')
            .skip(skip)
            .limit(limit);

        const total = await DocGia.countDocuments();

        res.json({
            message: 'Lấy danh sách độc giả thành công',
            docGia,
            total,
            page,
            limit
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin một độc giả
exports.getById = async (req, res) => {
    try {
        const docGia = await DocGia.findById(req.params._id).select('-matKhau');
        
        if (!docGia) {
            return res.status(404).json({ message: 'Không tìm thấy độc giả' });
        }
        res.json({
            message: 'Lấy thông tin độc giả thành công',
            docGia
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin độc giả
exports.update = async (req, res) => {
    try {
        const docGia = await DocGia.findById(req.params._id);
        if (!docGia) {
            return res.status(404).json({ message: 'Không tìm thấy độc giả' });
        }

        Object.assign(docGia, req.body);
        await docGia.save();

        res.json({
            message: 'Cập nhật thông tin độc giả thành công',
            docGia: {
                 _id: docGia._id,
                maDocGia: docGia.maDocGia,
                hoLot: docGia.hoLot,
                ten: docGia.ten,
                ngaySinh: docGia.ngaySinh,
                phai: docGia.phai,
                diaChi: docGia.diaChi,
                dienThoai: docGia.dienThoai,
                email: docGia.email,
                trangThai: docGia.trangThai
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Xóa độc giả
exports.delete = async (req, res) => {
    try {
        const docGia = await DocGia.findById(req.params._id);
        if (!docGia) {
            return res.status(404).json({ message: 'Không tìm thấy độc giả' });
        }

        await docGia.deleteOne();
        res.json({ message: 'Xóa độc giả thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Khóa/mở khóa tài khoản độc giả
exports.toggleStatus = async (req, res) => {
    try {
        const docGia = await DocGia.findById(req.params._id);
        if (!docGia) {
            return res.status(404).json({ message: 'Không tìm thấy độc giả' });
        }

        docGia.trangThai = docGia.trangThai === 'Hoạt động' ? 'Bị khóa' : 'Hoạt động';
        await docGia.save();

        res.json({
            message: 'Cập nhật trạng thái độc giả thành công',
            docGia: {
                 _id: docGia._id,
                maDocGia: docGia.maDocGia,
                hoLot: docGia.hoLot,
                ten: docGia.ten,
                trangThai: docGia.trangThai,
                updatedAt: docGia.updatedAt
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 