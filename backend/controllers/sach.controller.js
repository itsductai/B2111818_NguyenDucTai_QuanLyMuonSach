const Sach = require('../models/Sach.model');
console.log("sachcontroller nha");

// Lấy danh sách sách
exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sach = await Sach.find()
            .populate('maNXB', 'maNXB tenNXB')
            .sort({ maSach: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Sach.countDocuments();

        res.json({
            message: 'Lấy danh sách sách thành công',
            sach,
            total,
            page,
            limit
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tìm kiếm sách
exports.search = async (req, res) => {
    try {
        const { q } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sach = await Sach.find({
            $or: [
                { tenSach: { $regex: q, $options: 'i' } },
                { tacGia: { $regex: q, $options: 'i' } }
            ]
        })
            .populate('maNXB', 'maNXB tenNXB')
            .sort({ maSach: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Sach.countDocuments({
            $or: [
                { tenSach: { $regex: q, $options: 'i' } },
                { tacGia: { $regex: q, $options: 'i' } }
            ]
        });

        res.json({
            message: 'Tìm kiếm sách thành công',
            sach,
            total,
            page,
            limit
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin một cuốn sách
exports.getById = async (req, res) => {
    try {
        const sach = await Sach.findById(req.params._id)
            .populate('maNXB', 'maNXB tenNXB');

        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        res.json({
            message: 'Lấy thông tin sách thành công',
            sach
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm sách mới
exports.create = async (req, res) => {
    try {
        const sach = new Sach(req.body);
        const newSach = await sach.save();

        res.status(201).json({
            message: 'Thêm sách thành công',
            sach: newSach
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật thông tin sách
exports.update = async (req, res) => {
    try {
        const sach = await Sach.findById(req.params._id);
        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        Object.assign(sach, req.body);
        await sach.save();

        res.json({
            message: 'Cập nhật thông tin sách thành công',
            sach
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa sách
exports.delete = async (req, res) => {
    try {
        const sach = await Sach.findById(req.params._id);
        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        await sach.deleteOne();
        res.json({ message: 'Xóa sách thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật số quyển sách
exports.updateSoQuyen = async (req, res) => {
    try {
        const sach = await Sach.findById(req.params._id);
        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        const { soQuyen } = req.body;
        if (soQuyen < 0) {
            return res.status(400).json({ message: 'Số quyển không được âm' });
        }

        sach.soQuyen = soQuyen;
        await sach.save();

        res.json({
            message: 'Cập nhật số quyển sách thành công',
            sach: {
                maSach: sach.maSach,
                tenSach: sach.tenSach,
                soQuyen: sach.soQuyen,
                updatedAt: sach.updatedAt
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy danh sách sách mượn nhiều nhất
exports.getSachMuonNhieuNhat = async (req, res) => {
    try {
        const sachs = await Sach.aggregate([
            {
                $lookup: {
                    from: 'theodoimuonsachs',
                    localField: '_id',
                    foreignField: 'maSach',
                    as: 'muonSach'
                }
            },
            {
                $project: {
                    maSach: 1,
                    tenSach: 1,
                    tacGia: 1,
                    soQuyen: 1,
                    soLanMuon: { $size: '$muonSach' }
                }
            },
            {
                $sort: { soLanMuon: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.json(sachs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};