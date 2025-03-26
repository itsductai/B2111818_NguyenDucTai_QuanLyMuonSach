const NhaXuatBan = require('../models/NhaXuatBan.model');
const Sach = require('../models/Sach.model');

// Lấy danh sách nhà xuất bản
exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const nhaXuatBan = await NhaXuatBan.find()
            .sort({ maNXB: 1 })
            .skip(skip)
            .limit(limit);

        const total = await NhaXuatBan.countDocuments();

        res.json({
            message: 'Lấy danh sách nhà xuất bản thành công',
            nhaXuatBan,
            total,
            page,
            limit
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin một nhà xuất bản
exports.getById = async (req, res) => {
    try {
        const nhaXuatBan = await NhaXuatBan.findById(req.params._id);
        
        if (!nhaXuatBan) {
            return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
        }

        res.json({
            message: 'Lấy thông tin nhà xuất bản thành công',
            nhaXuatBan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm nhà xuất bản mới
exports.create = async (req, res) => {
    try {
        const nhaXuatBan = new NhaXuatBan(req.body);
        const newNhaXuatBan = await nhaXuatBan.save();

        res.status(201).json({
            message: 'Thêm nhà xuất bản thành công',
            nhaXuatBan: newNhaXuatBan
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Mã nhà xuất bản đã tồn tại' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật thông tin nhà xuất bản
exports.update = async (req, res) => {
    try {
        const nhaXuatBan = await NhaXuatBan.findById(req.params._id);
        if (!nhaXuatBan) {
            return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
        }

        Object.assign(nhaXuatBan, req.body);
        await nhaXuatBan.save();

        res.json({
            message: 'Cập nhật thông tin nhà xuất bản thành công',
            nhaXuatBan
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Mã nhà xuất bản đã tồn tại' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Xóa nhà xuất bản
exports.delete = async (req, res) => {
    try {
        const nhaXuatBan = await NhaXuatBan.findById(req.params._id);
        if (!nhaXuatBan) {
            return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
        }

        // Kiểm tra xem nhà xuất bản có sách không
        const coSach = await Sach.findOne({ maNhaXuatBan: req.params._id });
        if (coSach) {
            return res.status(400).json({ message: 'Không thể xóa nhà xuất bản đang có sách' });
        }

        await nhaXuatBan.deleteOne();
        res.json({ message: 'Xóa nhà xuất bản thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 