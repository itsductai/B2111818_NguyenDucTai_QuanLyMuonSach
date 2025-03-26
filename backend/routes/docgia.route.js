const express = require('express');
const router = express.Router();
const docGiaController = require('../controllers/docgia.controller');
const { auth, checkRole } = require('../middleware/auth.middleware');

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
router.get('/', auth, docGiaController.getAll);

/**
 * @route GET /api/doc-gia/:id
 * @description Lấy thông tin một độc giả
 * @access Private
 */
router.get('/:id', auth, docGiaController.getById);

/**
 * @route POST /api/doc-gia
 * @description Thêm độc giả mới
 * @access Private
 */
router.post('/', auth, docGiaController.create);

/**
 * @route PUT /api/doc-gia/:id
 * @description Cập nhật thông tin độc giả
 * @access Private
 */
router.put('/:id', auth, docGiaController.update);

/**
 * @route DELETE /api/doc-gia/:id
 * @description Xóa độc giả
 * @access Private
 */
router.delete('/:id', auth, docGiaController.delete);

module.exports = router; 