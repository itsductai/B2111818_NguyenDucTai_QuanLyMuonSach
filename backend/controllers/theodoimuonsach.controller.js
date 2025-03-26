const TheoDoiMuonSach = require('../models/TheoDoiMuonSach.model');
const Sach = require('../models/Sach.model');

class TheoDoiMuonSachController {
    /**
     * Lấy danh sách phiếu mượn
     * @route GET /api/muon-sach
     */
    async getAll(req, res) {
        try {
            const muonSach = await TheoDoiMuonSach.find();
            res.json(muonSach);
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi lấy danh sách phiếu mượn',
                error: error.message
            });
        }
    }

    /**
     * Lấy thông tin một phiếu mượn
     * @route GET /api/muon-sach/:id
     */
    async getById(req, res) {
        try {
            const muonSach = await TheoDoiMuonSach.findById(req.params.id);
            if (!muonSach) {
                return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
            }
            res.json(muonSach);
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi lấy thông tin phiếu mượn',
                error: error.message
            });
        }
    }

    /**
     * Tạo phiếu mượn mới
     * @route POST /api/muon-sach
     */
    async create(req, res) {
        try {
            // Kiểm tra số lượng sách còn lại
            const sach = await Sach.findById(req.body.maSach);
            if (!sach) {
                return res.status(404).json({ message: 'Không tìm thấy sách' });
            }
            if (sach.soQuyen <= 0) {
                return res.status(400).json({ message: 'Sách đã hết' });
            }

            // Tạo phiếu mượn
            const muonSach = await TheoDoiMuonSach.create(req.body);

            // Giảm số lượng sách
            await Sach.findByIdAndUpdate(req.body.maSach, {
                $inc: { soQuyen: -1 }
            });

            res.status(201).json(muonSach);
        } catch (error) {
            res.status(400).json({
                message: 'Lỗi khi tạo phiếu mượn',
                error: error.message
            });
        }
    }

    /**
     * Cập nhật thông tin phiếu mượn
     * @route PUT /api/muon-sach/:id
     */
    async update(req, res) {
        try {
            const muonSach = await TheoDoiMuonSach.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!muonSach) {
                return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
            }
            res.json(muonSach);
        } catch (error) {
            res.status(400).json({
                message: 'Lỗi khi cập nhật phiếu mượn',
                error: error.message
            });
        }
    }

    /**
     * Trả sách
     * @route PUT /api/muon-sach/:id/tra
     */
    async traSach(req, res) {
        try {
            const muonSach = await TheoDoiMuonSach.findById(req.params.id);
            if (!muonSach) {
                return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
            }

            if (muonSach.trangThai === 'Đã trả') {
                return res.status(400).json({ message: 'Sách đã được trả' });
            }

            // Cập nhật phiếu mượn
            muonSach.ngayTraThucTe = new Date();
            muonSach.trangThai = 'Đã trả';
            await muonSach.save();

            // Tăng số lượng sách
            await Sach.findByIdAndUpdate(muonSach.maSach, {
                $inc: { soQuyen: 1 }
            });

            res.json(muonSach);
        } catch (error) {
            res.status(400).json({
                message: 'Lỗi khi trả sách',
                error: error.message
            });
        }
    }

    /**
     * Xóa phiếu mượn
     * @route DELETE /api/muon-sach/:id
     */
    async delete(req, res) {
        try {
            const muonSach = await TheoDoiMuonSach.findByIdAndDelete(req.params.id);
            if (!muonSach) {
                return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
            }
            res.json({ message: 'Xóa phiếu mượn thành công' });
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi xóa phiếu mượn',
                error: error.message
            });
        }
    }
}

module.exports = new TheoDoiMuonSachController(); 