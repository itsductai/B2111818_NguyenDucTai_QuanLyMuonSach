const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NhaXuatBan = require('../models/NhaXuatBan.model');
const Sach = require('../models/Sach.model');
const DocGia = require('../models/DocGia.model');
const NhanVien = require('../models/NhanVien.model');

// Load biến môi trường
dotenv.config();

// Kết nối database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Kết nối database thành công để chèn dữ liệu mẫu'))
    .catch(err => console.error('Lỗi kết nối database:', err));

// Dữ liệu mẫu nhà xuất bản
const nhaxuatbanData = [
    {
        maNXB: 'NXB001',
        tenNXB: 'NXB Trẻ',
        diaChi: '161B Lý Chính Thắng, Phường 7, Quận 3, TPHCM'
    },
    {
        maNXB: 'NXB002',
        tenNXB: 'NXB Kim Đồng',
        diaChi: '55 Quang Trung, Hai Bà Trưng, Hà Nội'
    },
    {
        maNXB: 'NXB003',
        tenNXB: 'NXB Giáo Dục',
        diaChi: '81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội'
    }
];

// Dữ liệu mẫu sách
const sachData = [
    {
        maSach: 'SACH001',
        tenSach: 'Lập Trình Web Cơ Bản',
        donGia: 150000,
        soQuyen: 50,
        namXuatBan: 2023,
        nguonGoc: 'Mua'
    },
    {
        maSach: 'SACH002',
        tenSach: 'JavaScript Nâng Cao',
        donGia: 200000,
        soQuyen: 30,
        namXuatBan: 2023,
        nguonGoc: 'Mua'
    },
    {
        maSach: 'SACH003',
        tenSach: 'MongoDB cho Người Mới Bắt Đầu',
        donGia: 180000,
        soQuyen: 40,
        namXuatBan: 2024,
        nguonGoc: 'Mua'
    }
];

// Dữ liệu mẫu độc giả
const docgiaData = [
    {
        maDocGia: 'DG001',
        hoLot: 'Nguyễn Văn',
        ten: 'An',
        ngaySinh: new Date('2000-01-15'),
        phai: 'Nam',
        diaChi: '123 Nguyễn Văn Cừ, Quận 5, TPHCM',
        dienThoai: '0901234567'
    },
    {
        maDocGia: 'DG002',
        hoLot: 'Trần Thị',
        ten: 'Bình',
        ngaySinh: new Date('2001-05-20'),
        phai: 'Nữ',
        diaChi: '456 Lê Đại Hành, Quận 10, TPHCM',
        dienThoai: '0912345678'
    },
    {
        maDocGia: 'DG003',
        hoLot: 'Lê Hoàng',
        ten: 'Công',
        ngaySinh: new Date('1999-12-25'),
        phai: 'Nam',
        diaChi: '789 Lý Thường Kiệt, Quận 11, TPHCM',
        dienThoai: '0923456789'
    }
];

// Dữ liệu mẫu nhân viên
const nhanvienData = [
    {
        maNV: 'NV001',
        hoTenNV: 'Admin Hệ Thống',
        password: 'admin123',
        chucVu: 'Admin',
        diaChi: '111 Nguyễn Thị Minh Khai, Q1, TPHCM',
        soDienThoai: '0977777777'
    },
    {
        maNV: 'NV002',
        hoTenNV: 'Nhân Viên 1',
        password: 'nv123456',
        chucVu: 'Nhân viên',
        diaChi: '222 Lê Lợi, Q5, TPHCM',
        soDienThoai: '0988888888'
    },
    {
        maNV: 'NV003',
        hoTenNV: 'Nhân Viên 2',
        password: 'nv654321',
        chucVu: 'Nhân viên',
        diaChi: '333 Võ Văn Tần, Q3, TPHCM',
        soDienThoai: '0999999999'
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

        // Chèn nhà xuất bản
        const nxbs = await NhaXuatBan.insertMany(nhaxuatbanData);
        console.log('Đã chèn dữ liệu nhà xuất bản');

        // Chèn sách và liên kết với nhà xuất bản
        const sachWithNXB = sachData.map((sach, index) => ({
            ...sach,
            maNXB: nxbs[index % nxbs.length]._id
        }));
        await Sach.insertMany(sachWithNXB);
        console.log('Đã chèn dữ liệu sách');

        // Chèn độc giả
        await DocGia.insertMany(docgiaData);
        console.log('Đã chèn dữ liệu độc giả');

        // Chèn nhân viên
        await NhanVien.insertMany(nhanvienData);
        console.log('Đã chèn dữ liệu nhân viên');

        console.log('Hoàn thành chèn dữ liệu mẫu');
        process.exit();
    } catch (error) {
        console.error('Lỗi khi chèn dữ liệu:', error);
        process.exit(1);
    }
};

insertData(); 