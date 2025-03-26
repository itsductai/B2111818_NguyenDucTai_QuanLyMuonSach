const express = require('express');
const router = express.Router();
const nhaXuatBanController = require('../controllers/nhaxuatban.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @route GET /api/nha-xuat-ban
 * @description Lấy danh sách nhà xuất bản
 * @access Public
 */
router.get('/', nhaXuatBanController.getAll);

/**
 * @route GET /api/nha-xuat-ban/:id
 * @description Lấy thông tin một nhà xuất bản
 * @access Public
 */
router.get('/:id', nhaXuatBanController.getById);

/**
 * @route POST /api/nha-xuat-ban
 * @description Thêm nhà xuất bản mới (chỉ Admin)
 * @access Private
 */
router.post('/', [verifyToken, isAdmin], nhaXuatBanController.create);

/**
 * @route PUT /api/nha-xuat-ban/:id
 * @description Cập nhật thông tin nhà xuất bản (chỉ Admin)
 * @access Private
 */
router.put('/:id', [verifyToken, isAdmin], nhaXuatBanController.update);

/**
 * @route DELETE /api/nha-xuat-ban/:id
 * @description Xóa nhà xuất bản (chỉ Admin)
 * @access Private
 */
router.delete('/:id', [verifyToken, isAdmin], nhaXuatBanController.delete);

module.exports = router; 