const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const NhaXuatBan = require('../models/NhaXuatBan.model');
const Sach = require('../models/Sach.model');
const DocGia = require('../models/DocGia.model');
const NhanVien = require('../models/NhanVien.model');
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach.model');
require('dotenv').config();

// Kết nối database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Kết nối database thành công để chèn dữ liệu mẫu'))
    .catch((err) => console.error('Lỗi kết nối database:', err));

// Dữ liệu mẫu nhà xuất bản
const nhaXuatBanData = [
    {
        maNXB: 'NXB001',
        tenNXB: 'NXB Kim Đồng',
        diaChi: 'Số 55 Quang Trung, Hai Bà Trưng, Hà Nội'
    },
    {
        maNXB: 'NXB002',
        tenNXB: 'NXB Trẻ',
        diaChi: 'Số 161B Lý Chính Thắng, Phường 7, Quận 3, TP.HCM'
    },
    {
        maNXB: 'NXB003',
        tenNXB: 'NXB Giáo Dục',
        diaChi: 'Số 81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội'
    }
];

// Dữ liệu mẫu sách
const sachData = [
    {
        tenSach: 'Doraemon',
        tacGia: 'Fujiko F. Fujio',
        namXuatBan: 2020,
        soQuyen: 50,
        donGia: 35000,
        hinhAnh: 'https://example.com/images/doraemon.jpg'
    },
    {
        tenSach: 'Conan',
        tacGia: 'Gosho Aoyama',
        namXuatBan: 2021,
        soQuyen: 30,
        donGia: 40000,
        hinhAnh: 'https://example.com/images/conan.jpg'
    },
    {
        tenSach: 'Toán học 12',
        tacGia: 'Bộ Giáo Dục',
        namXuatBan: 2022,
        soQuyen: 100,
        donGia: 20000,
        hinhAnh: 'https://example.com/images/toan12.jpg'
    }
];

// Dữ liệu mẫu độc giả
const docGiaData = [
    {
        hoLot: 'Nguyễn Văn',
        ten: 'A',
        ngaySinh: new Date('2000-01-01'),
        phai: 'Nam',
        diaChi: 'Số 1 Tạ Quang Bửu, Hai Bà Trưng, Hà Nội',
        dienThoai: '0123456789',
        email: 'nguyenvana@gmail.com',
        matKhau: '123456',
        ngayDangKy: new Date(),
        trangThai: 'Hoạt động'
    },
    {
        hoLot: 'Trần Thị',
        ten: 'B',
        ngaySinh: new Date('2001-02-02'),
        phai: 'Nữ',
        diaChi: 'Số 2 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội',
        dienThoai: '0987654321',
        email: 'tranthib@gmail.com',
        matKhau: '123456',
        ngayDangKy: new Date(),
        trangThai: 'Hoạt động'
    },
    {
        hoLot: 'Lê Văn',
        ten: 'C',
        ngaySinh: new Date('2002-03-03'),
        phai: 'Nam',
        diaChi: 'Số 3 Giải Phóng, Hai Bà Trưng, Hà Nội',
        dienThoai: '0369852147',
        email: 'levanc@gmail.com',
        matKhau: '123456',
        ngayDangKy: new Date(),
        trangThai: 'Hoạt động'
    }
];

// Dữ liệu mẫu nhân viên
const nhanVienData = [
    {
        hoTenNV: 'Admin',
        password: '123456',
        chucVu: 'Admin',
        diaChi: 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
        soDienThoai: '0123456789',
        email: 'admin@gmail.com'
    },
    {
        hoTenNV: 'Nhân viên 1',
        password: '123456',
        chucVu: 'Nhân viên',
        diaChi: 'Số 2 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
        soDienThoai: '0987654321',
        email: 'nhanvien1@gmail.com'
    }
];

// Hàm chèn dữ liệu
const insertData = async () => {
    try {
        // Xóa dữ liệu cũ
        await NhaXuatBan.deleteMany();
        await Sach.deleteMany();
        await DocGia.deleteMany();
        await NhanVien.deleteMany();
        await TheoDoiMuonSach.deleteMany();

        // Chèn nhà xuất bản
        const nxbs = await NhaXuatBan.insertMany(nhaXuatBanData);
        console.log('Đã chèn dữ liệu nhà xuất bản');

        // Chèn sách từng cái một
        const sachs = [];
        for (const sach of sachData) {
            const newSach = new Sach({
                ...sach,
                maNXB: nxbs[sachs.length % nxbs.length]._id
            });
            await newSach.save();
            sachs.push(newSach);
        }
        console.log('Đã chèn dữ liệu sách');

        // Chèn độc giả từng cái một
        const docGias = [];
        for (const docGia of docGiaData) {
            const newDocGia = new DocGia(docGia);
            await newDocGia.save();
            docGias.push(newDocGia);
        }
        console.log('Đã chèn dữ liệu độc giả');

        // Chèn nhân viên từng cái một
        const nhanViens = [];
        for (const nhanVien of nhanVienData) {
            const newNhanVien = new NhanVien(nhanVien);
            await newNhanVien.save();
            nhanViens.push(newNhanVien);
        }
        console.log('Đã chèn dữ liệu nhân viên');

        // Tạo dữ liệu mượn sách mẫu
        const muonSachData = [
            {
                maDocGia: docGias[0]._id,
                maSach: sachs[0]._id,
                ngayMuon: new Date('2024-03-01'),
                ngayTra: new Date('2024-03-15')
            },
            {
                maDocGia: docGias[1]._id,
                maSach: sachs[1]._id,
                ngayMuon: new Date('2024-03-05'),
                ngayTra: new Date('2024-03-19')
            }
        ];

        // Chèn dữ liệu mượn sách
        await TheoDoiMuonSach.insertMany(muonSachData);
        console.log('Đã chèn dữ liệu mượn sách');

        console.log('Chèn dữ liệu mẫu thành công');
        process.exit();
    } catch (error) {
        console.warn('Lỗi khi chèn dữ liệu:', error);
        process.exit(1);
    }
};

// Chạy hàm chèn dữ liệu
insertData(); 