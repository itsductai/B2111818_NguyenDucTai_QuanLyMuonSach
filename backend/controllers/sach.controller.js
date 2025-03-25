const sachService = require('../services/sach.service');

class SachController {
    /**
     * Lấy danh sách sách với phân trang và tìm kiếm
     * @route GET /api/sach
     */
    async getAllSach(req, res) {
        try {
            const { page = 1, limit = 10, tenSach, maNXB } = req.query;
            const filter = {};
            
            // Xây dựng filter từ query params
            if (tenSach) filter.tenSach = tenSach;
            if (maNXB) filter.maNXB = maNXB;

            const result = await sachService.getAllSach(filter, { page, limit });
            res.json(result);
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Lỗi khi lấy danh sách sách'
            });
        }
    }

    /**
     * Lấy thông tin một sách
     * @route GET /api/sach/:id
     */
    async getSachById(req, res) {
        try {
            const sach = await sachService.getSachById(req.params.id);
            res.json(sach);
        } catch (error) {
            res.status(404).json({
                message: error.message || 'Không tìm thấy sách'
            });
        }
    }

    /**
     * Tạo sách mới
     * @route POST /api/sach
     */
    async createSach(req, res) {
        try {
            const sach = await sachService.createSach(req.body);
            res.status(201).json({
                message: 'Tạo sách thành công',
                sach
            });
        } catch (error) {
            res.status(400).json({
                message: error.message || 'Lỗi khi tạo sách'
            });
        }
    }

    /**
     * Cập nhật thông tin sách
     * @route PUT /api/sach/:id
     */
    async updateSach(req, res) {
        try {
            const sach = await sachService.updateSach(req.params.id, req.body);
            res.json({
                message: 'Cập nhật sách thành công',
                sach
            });
        } catch (error) {
            res.status(400).json({
                message: error.message || 'Lỗi khi cập nhật sách'
            });
        }
    }

    /**
     * Xóa sách
     * @route DELETE /api/sach/:id
     */
    async deleteSach(req, res) {
        try {
            const result = await sachService.deleteSach(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(400).json({
                message: error.message || 'Lỗi khi xóa sách'
            });
        }
    }

    /**
     * Cập nhật số lượng sách
     * @route PATCH /api/sach/:id/so-luong
     */
    async updateSoLuong(req, res) {
        try {
            const { soLuong } = req.body;
            if (typeof soLuong !== 'number') {
                return res.status(400).json({
                    message: 'Số lượng phải là một số'
                });
            }

            const sach = await sachService.updateSoLuong(req.params.id, soLuong);
            res.json({
                message: 'Cập nhật số lượng sách thành công',
                sach
            });
        } catch (error) {
            res.status(400).json({
                message: error.message || 'Lỗi khi cập nhật số lượng sách'
            });
        }
    }

    /**
     * Lấy thống kê sách mượn nhiều nhất
     * @route GET /api/sach/thong-ke/muon-nhieu-nhat
     */
    async getSachMuonNhieuNhat(req, res) {
        try {
            const { limit = 10 } = req.query;
            const thongKe = await sachService.getSachMuonNhieuNhat(Number(limit));
            res.json(thongKe);
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Lỗi khi lấy thống kê sách'
            });
        }
    }
}

module.exports = new SachController(); 