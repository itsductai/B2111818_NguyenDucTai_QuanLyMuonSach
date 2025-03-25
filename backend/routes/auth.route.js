const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

/**
 * @route POST /api/auth/login
 * @description Đăng nhập hệ thống
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /api/auth/register
 * @description Đăng ký tài khoản mới (chỉ Admin mới có quyền)
 * @access Private
 */
router.post('/register', [verifyToken, isAdmin], authController.register);

module.exports = router; 