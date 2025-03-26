const express = require('express');
const router = express.Router();
const sachController = require('../controllers/sach.controller');

console.log('sachController:', sachController);

/**
 * @route GET /api/sach
 * @description Lấy danh sách sách với phân trang và tìm kiếm
 * @access Public
 */
router.get('/', sachController.getAll);

/**
 * @route GET /api/sach/search
 * @description Tìm kiếm sách
 * @access Public
 */
router.get('/search', sachController.search);

/**
 * @route GET /api/sach/:id
 * @description Lấy thông tin một sách
 * @access Public
 */
router.get('/:_id', sachController.getById);

/**
 * @route POST /api/sach
 * @description Tạo sách mới (chỉ Admin)
 * @access Private
 */
console.log("Dung o day")
router.post('/', sachController.create);
console.log("Dung o day")
/**
 * @route PUT /api/sach/:id
 * @description Cập nhật thông tin sách (chỉ Admin)
 * @access Private
 */
router.put('/:_id', sachController.update);
console.log("Dung o day")
/**
 * @route DELETE /api/sach/:id
 * @description Xóa sách (chỉ Admin)
 * @access Private
 */
router.delete('/:_id', sachController.delete);
console.log("Dung o day")
/**
 * @route PATCH /api/sach/:id/so-luong
 * @description Cập nhật số lượng sách (Admin và Nhân viên)
 * @access Private
 */
router.patch('/:_id/so-luong', sachController.updateSoQuyen);
console.log("Dung o day!!!!!")
/**
 * @route GET /api/sach/thong-ke/muon-nhieu-nhat
 * @description Lấy thống kê sách mượn nhiều nhất (Admin)
 * @access Private
 */
router.get('/thong-ke/muon-nhieu-nhat', sachController.getSachMuonNhieuNhat);
console.log("Dung o day!!!!!")
module.exports = router; 