const express = require('express');
const router = express.Router();
const docGiaController = require('../controllers/docgia.controller');

console.log('docgiaController:', docGiaController);

/**
 * @route POST /api/doc-gia/login
 * @description Đăng nhập
 * @access Public
 */
router.post('/login', docGiaController.login);

/**
 * @route GET /api/doc-gia
 * @description Lấy danh sách độc giả
 * @access Private
 */
router.get('/', docGiaController.getAll);

/**
 * @route GET /api/doc-gia/:id
 * @description Lấy thông tin một độc giả
 * @access Private
 */
router.get('/:id',docGiaController.getById);

/**
 * @route PUT /api/doc-gia/:id
 * @description Cập nhật thông tin độc giả
 * @access Private
 */
router.put('/:id',  docGiaController.update);

/**
 * @route DELETE /api/doc-gia/:id
 * @description Xóa độc giả
 * @access Private
 */
router.delete('/:id', docGiaController.delete);

/**
 * @route PATCH /api/doc-gia/:id/trang-thai
 * @description Khóa/mở khóa tài khoản độc giả
 * @access Private
 */
router.patch('/:id/trang-thai', docGiaController.toggleStatus);

module.exports = router; 