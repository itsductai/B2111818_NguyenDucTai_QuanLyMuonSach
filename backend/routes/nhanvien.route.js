const express = require('express');
const router = express.Router();
const nhanVienController = require('../controllers/nhanvien.controller');
const { auth, checkRole } = require('../middleware/auth.middleware');

/**
 * @route POST /api/nhan-vien/login
 * @description Đăng nhập
 * @access Public
 */
router.post('/login', nhanVienController.login);

/**
 * @route GET /api/nhan-vien
 * @description Lấy danh sách nhân viên
 * @access Private (Admin only)
 */
router.use(verifyToken, isAdmin);

router.get('/', nhanVienController.getAll);

/**
 * @route GET /api/nhan-vien/:id
 * @description Lấy thông tin một nhân viên
 * @access Private (Admin only)
 */
router.get('/:id', nhanVienController.getById);

/**
 * @route POST /api/nhan-vien
 * @description Thêm nhân viên mới
 * @access Private (Admin only)
 */
router.post('/', nhanVienController.create);

/**
 * @route PUT /api/nhan-vien/:id
 * @description Cập nhật thông tin nhân viên
 * @access Private (Admin only)
 */
router.put('/:id', nhanVienController.update);

/**
 * @route DELETE /api/nhan-vien/:id
 * @description Xóa nhân viên
 * @access Private (Admin only)
 */
router.delete('/:id', nhanVienController.delete);

module.exports = router; 