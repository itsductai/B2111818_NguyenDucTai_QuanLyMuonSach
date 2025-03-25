const authService = require('../services/auth.service');

class AuthController {
    /**
     * Xử lý đăng nhập
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async login(req, res) {
        try {
            const { maNV, password } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!maNV || !password) {
                return res.status(400).json({
                    message: 'Vui lòng nhập đầy đủ mã nhân viên và mật khẩu'
                });
            }

            // Gọi service xử lý đăng nhập
            const result = await authService.login(maNV, password);

            res.json({
                message: 'Đăng nhập thành công',
                ...result
            });
        } catch (error) {
            res.status(400).json({
                message: error.message || 'Đăng nhập thất bại'
            });
        }
    }

    /**
     * Xử lý đăng ký tài khoản mới
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async register(req, res) {
        try {
            const { maNV, hoTenNV, password, chucVu, diaChi, soDienThoai } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!maNV || !hoTenNV || !password || !chucVu || !diaChi || !soDienThoai) {
                return res.status(400).json({
                    message: 'Vui lòng nhập đầy đủ thông tin nhân viên'
                });
            }

            // Gọi service xử lý đăng ký
            const nhanVien = await authService.register({
                maNV,
                hoTenNV,
                password,
                chucVu,
                diaChi,
                soDienThoai
            });

            res.status(201).json({
                message: 'Đăng ký tài khoản thành công',
                nhanVien
            });
        } catch (error) {
            res.status(400).json({
                message: error.message || 'Đăng ký tài khoản thất bại'
            });
        }
    }
}

module.exports = new AuthController(); 