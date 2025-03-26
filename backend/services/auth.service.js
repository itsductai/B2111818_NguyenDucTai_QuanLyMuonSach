// const bcrypt = require('bcryptjs');
// const NhanVien = require('../models/NhanVien.model');

// class AuthService {

//     async login(maNV, matKhau) {
//         // Tìm nhân viên theo mã
//         const nhanVien = await NhanVien.findOne({ maNV });
//         if (!nhanVien) {
//             throw new Error('Mã nhân viên không tồn tại');
//         }

//         // Kiểm tra mật khẩu
//         const isMatch = await nhanVien.comparePassword(matKhau);
//         if (!isMatch) {
//             throw new Error('Mật khẩu không chính xác');
//         }


//         return {
//             nhanVien: {

//                 maNV: nhanVien.maNV,
//                 hoTenNV: nhanVien.hoTenNV,
//                 email: nhanVien.email,
//                 chucVu: nhanVien.chucVu
//             }
//         };
//     }

//     /**
//      * Đăng ký tài khoản nhân viên mới
//      * @param {Object} nhanVienData - Thông tin nhân viên
//      * @returns {Object} Thông tin nhân viên đã tạo
//      */
//     async register(nhanVienData) {
//         // Email nhân viên đã tồn tại
//         const existingNhanVien = await NhanVien.findOne({ 
//             $or: [
//                 { email: nhanVienData.email },
//                 { maNV: nhanVienData.maNV }
//             ]
//         });
//         if (existingNhanVien) {
//             throw new Error('Email hoặc mã nhân viên đã tồn tại');
//         }

//         // Tạo nhân viên mới
//         const nhanVien = new NhanVien(nhanVienData);
//         await nhanVien.save();

//         return {
//             maNV: nhanVien.maNV,
//             hoTenNV: nhanVien.hoTenNV,
//             email: nhanVien.email,
//             chucVu: nhanVien.chucVu,
//             diaChi: nhanVien.diaChi,
//             soDienThoai: nhanVien.soDienThoai
//         };
//     }
// }

// module.exports = new AuthService(); 