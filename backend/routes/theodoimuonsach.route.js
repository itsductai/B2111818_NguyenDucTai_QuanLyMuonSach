const express = require('express');
const router = express.Router();
const theoDoiMuonSachController = require('../controllers/theodoimuonsach.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

/**
 * @route GET /api/muon-sach
 * @description Lấy danh sách phiếu mượn
 * @access Private
 */
router.get('/', verifyToken, theoDoiMuonSachController.getAll);

/**
 * @route GET /api/muon-sach/:id
 * @description Lấy thông tin một phiếu mượn
 * @access Private
 */
router.get('/:id', verifyToken, theoDoiMuonSachController.getById);

/**
 * @route POST /api/muon-sach
 * @description Tạo phiếu mượn mới
 * @access Private
 */
router.post('/', verifyToken, theoDoiMuonSachController.create);

/**
 * @route PUT /api/muon-sach/:id
 * @description Cập nhật thông tin phiếu mượn
 * @access Private
 */
router.put('/:id', verifyToken, theoDoiMuonSachController.update);

/**
 * @route PUT /api/muon-sach/:id/tra
 * @description Trả sách
 * @access Private
 */
router.put('/:id/tra', verifyToken, theoDoiMuonSachController.traSach);

/**
 * @route DELETE /api/muon-sach/:id
 * @description Xóa phiếu mượn
 * @access Private
 */
router.delete('/:id', verifyToken, theoDoiMuonSachController.delete);

module.exports = router; 