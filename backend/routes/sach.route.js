const express = require('express');
const router = express.Router();
const sachController = require('../controllers/sach.controller');
const { auth, checkRole } = require('../middleware/auth.middleware');

/**
 * @route GET /api/sach
 * @description Lấy danh sách sách với phân trang và tìm kiếm
 * @access Public
 */
router.get('/', sachController.getAllSach);

/**
 * @route GET /api/sach/:id
 * @description Lấy thông tin một sách
 * @access Public
 */
router.get('/:id', sachController.getSachById);

/**
 * @route POST /api/sach
 * @description Tạo sách mới (chỉ Admin)
 * @access Private
 */
router.post('/', [verifyToken, isAdmin], sachController.createSach);

/**
 * @route PUT /api/sach/:id
 * @description Cập nhật thông tin sách (chỉ Admin)
 * @access Private
 */
router.put('/:id', [verifyToken, isAdmin], sachController.updateSach);

/**
 * @route DELETE /api/sach/:id
 * @description Xóa sách (chỉ Admin)
 * @access Private
 */
router.delete('/:id', [verifyToken, isAdmin], sachController.deleteSach);

/**
 * @route PATCH /api/sach/:id/so-luong
 * @description Cập nhật số lượng sách (Admin và Nhân viên)
 * @access Private
 */
router.patch('/:id/so-luong', verifyToken, sachController.updateSoLuong);

/**
 * @route GET /api/sach/thong-ke/muon-nhieu-nhat
 * @description Lấy thống kê sách mượn nhiều nhất (Admin)
 * @access Private
 */
router.get('/thong-ke/muon-nhieu-nhat', [verifyToken, isAdmin], sachController.getSachMuonNhieuNhat);

module.exports = router; 