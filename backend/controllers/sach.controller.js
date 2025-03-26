const sachService = require('../services/sach.service');
const Sach = require('../models/Sach.model');

class SachController {
    /**
     * Lấy danh sách sách với phân trang và tìm kiếm
     * @route GET /api/sach
     */
    async getAllSach(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const skip = (page - 1) * limit;

            const [sach, total] = await Promise.all([
                Sach.find()
                    .skip(skip)
                    .limit(parseInt(limit))
                    .sort({ createdAt: -1 }),
                Sach.countDocuments()
            ]);

            res.json({
                sach,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                total
            });
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi lấy danh sách sách',
                error: error.message
            });
        }
    }

    /**
     * Lấy thông tin một sách
     * @route GET /api/sach/:id
     */
    async getSachById(req, res) {
        try {
            const sach = await Sach.findById(req.params.id);
            if (!sach) {
                return res.status(404).json({ message: 'Không tìm thấy sách' });
            }
            res.json(sach);
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi lấy thông tin sách',
                error: error.message
            });
        }
    }

    /**
     * Tạo sách mới
     * @route POST /api/sach
     */
    async createSach(req, res) {
        try {
            const sach = await Sach.create(req.body);
            res.status(201).json(sach);
        } catch (error) {
            res.status(400).json({
                message: 'Lỗi khi tạo sách',
                error: error.message
            });
        }
    }

    /**
     * Cập nhật thông tin sách
     * @route PUT /api/sach/:id
     */
    async updateSach(req, res) {
        try {
            const sach = await Sach.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!sach) {
                return res.status(404).json({ message: 'Không tìm thấy sách' });
            }
            res.json(sach);
        } catch (error) {
            res.status(400).json({
                message: 'Lỗi khi cập nhật sách',
                error: error.message
            });
        }
    }

    /**
     * Xóa sách
     * @route DELETE /api/sach/:id
     */
    async deleteSach(req, res) {
        try {
            const sach = await Sach.findByIdAndDelete(req.params.id);
            if (!sach) {
                return res.status(404).json({ message: 'Không tìm thấy sách' });
            }
            res.json({ message: 'Xóa sách thành công' });
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi xóa sách',
                error: error.message
            });
        }
    }

    /**
     * Cập nhật số lượng sách
     * @route PATCH /api/sach/:id/so-luong
     */
    async updateSoLuong(req, res) {
        try {
            const { soQuyen } = req.body;
            if (soQuyen < 0) {
                return res.status(400).json({ message: 'Số lượng sách không được âm' });
            }

            const sach = await Sach.findByIdAndUpdate(
                req.params.id,
                { soQuyen },
                { new: true }
            );
            if (!sach) {
                return res.status(404).json({ message: 'Không tìm thấy sách' });
            }
            res.json(sach);
        } catch (error) {
            res.status(400).json({
                message: 'Lỗi khi cập nhật số lượng sách',
                error: error.message
            });
        }
    }

    /**
     * Lấy thống kê sách mượn nhiều nhất
     * @route GET /api/sach/thong-ke/muon-nhieu-nhat
     */
    async getSachMuonNhieuNhat(req, res) {
        try {
            const sach = await Sach.find()
                .sort({ soLanMuon: -1 })
                .limit(10);
            res.json(sach);
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi lấy thống kê sách mượn nhiều nhất',
                error: error.message
            });
        }
    }

    /**
     * Tìm kiếm sách
     * @route GET /api/sach/search
     */
    async search(req, res) {
        try {
            const { query } = req.query;
            const sach = await Sach.find({
                $or: [
                    { tenSach: { $regex: query, $options: 'i' } },
                    { tacGia: { $regex: query, $options: 'i' } }
                ]
            });
            res.json(sach);
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi tìm kiếm sách',
                error: error.message
            });
        }
    }
}

module.exports = new SachController(); 