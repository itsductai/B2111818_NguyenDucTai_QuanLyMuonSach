const express = require('express');
const router = express.Router();
const nhaXuatBanController = require('../controllers/nhaxuatban.controller');

console.log('nxbController:', nhaXuatBanController);
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
router.get('/:_id', nhaXuatBanController.getById);

/**
 * @route POST /api/nha-xuat-ban
 * @description Thêm nhà xuất bản mới (chỉ Admin)
 * @access Private
 */
router.post('/', nhaXuatBanController.create);

/**
 * @route PUT /api/nha-xuat-ban/:id
 * @description Cập nhật thông tin nhà xuất bản (chỉ Admin)
 * @access Private
 */
router.put('/:_id', nhaXuatBanController.update);

/**
 * @route DELETE /api/nha-xuat-ban/:id
 * @description Xóa nhà xuất bản (chỉ Admin)
 * @access Private
 */
router.delete('/:_id', nhaXuatBanController.delete);

module.exports = router; 