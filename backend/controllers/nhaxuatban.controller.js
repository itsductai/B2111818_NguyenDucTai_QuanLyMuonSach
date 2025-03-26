const NhaXuatBan = require('../models/NhaXuatBan.model');

class NhaXuatBanController {
    /**
     * Lấy danh sách nhà xuất bản
     * @route GET /api/nha-xuat-ban
     */
    async getAll(req, res) {
        try {
            const nhaXuatBan = await NhaXuatBan.find();
            res.json(nhaXuatBan);
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi lấy danh sách nhà xuất bản',
                error: error.message
            });
        }
    }

    /**
     * Lấy thông tin một nhà xuất bản
     * @route GET /api/nha-xuat-ban/:id
     */
    async getById(req, res) {
        try {
            const nhaXuatBan = await NhaXuatBan.findById(req.params.id);
            if (!nhaXuatBan) {
                return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
            }
            res.json(nhaXuatBan);
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi lấy thông tin nhà xuất bản',
                error: error.message
            });
        }
    }

    /**
     * Thêm nhà xuất bản mới
     * @route POST /api/nha-xuat-ban
     */
    async create(req, res) {
        try {
            const nhaXuatBan = await NhaXuatBan.create(req.body);
            res.status(201).json(nhaXuatBan);
        } catch (error) {
            res.status(400).json({
                message: 'Lỗi khi thêm nhà xuất bản',
                error: error.message
            });
        }
    }

    /**
     * Cập nhật thông tin nhà xuất bản
     * @route PUT /api/nha-xuat-ban/:id
     */
    async update(req, res) {
        try {
            const nhaXuatBan = await NhaXuatBan.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!nhaXuatBan) {
                return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
            }
            res.json(nhaXuatBan);
        } catch (error) {
            res.status(400).json({
                message: 'Lỗi khi cập nhật nhà xuất bản',
                error: error.message
            });
        }
    }

    /**
     * Xóa nhà xuất bản
     * @route DELETE /api/nha-xuat-ban/:id
     */
    async delete(req, res) {
        try {
            const nhaXuatBan = await NhaXuatBan.findByIdAndDelete(req.params.id);
            if (!nhaXuatBan) {
                return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
            }
            res.json({ message: 'Xóa nhà xuất bản thành công' });
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi khi xóa nhà xuất bản',
                error: error.message
            });
        }
    }
}

module.exports = new NhaXuatBanController(); 