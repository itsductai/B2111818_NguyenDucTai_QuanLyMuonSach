const express = require('express');
const router = express.Router();
const theoDoiMuonSachController = require('../controllers/theodoimuonsach.controller');

console.log('theodoiController:', theoDoiMuonSachController);
/**
 * @route GET /api/muon-sach
 * @description Lấy danh sách phiếu mượn
 * @access Private
 */
router.get('/', theoDoiMuonSachController.getAll);

/**
 * @route GET /api/muon-sach/:id
 * @description Lấy thông tin một phiếu mượn
 * @access Private
 */
router.get('/:id',theoDoiMuonSachController.getById);

/**
 * @route POST /api/muon-sach
 * @description Tạo phiếu mượn mới
 * @access Private
 */
router.post('/', theoDoiMuonSachController.create);

/**
 * @route PUT /api/muon-sach/:id
 * @description Cập nhật thông tin phiếu mượn
 * @access Private
 */
router.patch('/:id/duyet', theoDoiMuonSachController.approveMuonSach);


router.put('/:id', theoDoiMuonSachController.update);

/**
 * @route DELETE /api/muon-sach/:id
 * @description Xóa phiếu mượn
 * @access Private
 */
router.delete('/:id', theoDoiMuonSachController.delete);

/**
 * @route GET /api/muon-sach/doc-gia/:maDocGia
 * @description Lấy danh sách sách đang mượn của một độc giả
 * @access Private
 */
router.get('/doc-gia/:maDocGia', theoDoiMuonSachController.getByDocGia);

module.exports = router; 