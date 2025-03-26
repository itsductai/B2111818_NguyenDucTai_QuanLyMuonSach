const NhanVien = require('../models/NhanVien.model');

// Đăng nhập nhân viên
exports.login = async (req, res) => {
    try {
        const { email, matKhau } = req.body;
        const nhanVien = await NhanVien.findOne({ email });

        if (!nhanVien) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await nhanVien.comparePassword(matKhau);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }


        res.json({
            message: 'Đăng nhập thành công',
            nhanVien: {
                _id: nhanVien._id,
                maNV: nhanVien.maNV,
                hoTenNV: nhanVien.hoTenNV,
                email: nhanVien.email,
                chucVu: nhanVien.chucVu
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách nhân viên
exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const nhanVien = await NhanVien.find()
            .select('-matKhau')
            .skip(skip)
            .limit(limit);

        const total = await NhanVien.countDocuments();

        res.json({
            message: 'Lấy danh sách nhân viên thành công',
            nhanVien,
            total,
            page,
            limit
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin một nhân viên
exports.getById = async (req, res) => {
    try {
        const nhanVien = await NhanVien.findById(req.params._id).select('-matKhau');
        
        if (!nhanVien) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }
        res.json({
            message: 'Lấy thông tin nhân viên thành công',
            nhanVien
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm nhân viên mới
exports.create = async (req, res) => {
    try {
        const nhanVien = new NhanVien(req.body);
        const newNhanVien = await nhanVien.save();

        res.status(201).json({
            message: 'Thêm nhân viên thành công',
            nhanVien: {
                _id: newNhanVien._id,
                maNV: newNhanVien.maNV,
                hoTenNV: newNhanVien.hoTenNV,
                email: newNhanVien.email,
                chucVu: newNhanVien.chucVu
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật thông tin nhân viên
exports.update = async (req, res) => {
    try {
        const nhanVien = await NhanVien.findById(req.params._id);
        if (!nhanVien) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }

        Object.assign(nhanVien, req.body);
        await nhanVien.save();

        res.json({
            message: 'Cập nhật thông tin nhân viên thành công',
            nhanVien: {
                _id: nhanVien._id,
                maNV: nhanVien.maNV,
                hoTenNV: nhanVien.hoTenNV,
                email: nhanVien.email,
                chucVu: nhanVien.chucVu,
                diaChi: nhanVien.diaChi,
                soDienThoai: nhanVien.soDienThoai
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Xóa nhân viên
exports.delete = async (req, res) => {
    try {
        const nhanVien = await NhanVien.findById(req.params._id);
        if (!nhanVien) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        }

        await nhanVien.deleteOne();
        res.json({ message: 'Xóa nhân viên thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 