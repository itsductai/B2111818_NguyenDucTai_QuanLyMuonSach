const authService = require('../services/auth.service');

class AuthController {
    /**
     * Xử lý đăng nhập
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     */
    async login(req, res) {
        try {
            const { maNV, matKhau } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!maNV || !matKhau) {
                return res.status(400).json({
                    message: 'Vui lòng nhập đầy đủ mã nhân viên và mật khẩu'
                });
            }

            // Gọi service xử lý đăng nhập
            const result = await authService.login(maNV, matKhau);

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
            const { maNV, hoTenNV, matKhau, chucVu, diaChi, soDienThoai, email } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!maNV || !hoTenNV || !matKhau || !chucVu || !diaChi || !soDienThoai || !email) {
                return res.status(400).json({
                    message: 'Vui lòng nhập đầy đủ thông tin nhân viên'
                });
            }

            // Gọi service xử lý đăng ký
            const nhanVien = await authService.register({
                maNV,
                hoTenNV,
                matKhau,
                chucVu,
                diaChi,
                soDienThoai,
                email
            });

            res.status(201).json({
                message: 'Đăng ký tài khoản thành công',
                nhanVien: {
                    maNV: nhanVien.maNV,
                    hoTenNV: nhanVien.hoTenNV,
                    email: nhanVien.email,
                    chucVu: nhanVien.chucVu
                }
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Email hoặc mã nhân viên đã tồn tại' });
            }
            res.status(400).json({
                message: error.message || 'Đăng ký tài khoản thất bại'
            });
        }
    }
}

module.exports = new AuthController(); 