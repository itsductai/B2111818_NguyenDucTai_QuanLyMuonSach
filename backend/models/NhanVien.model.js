const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const NhanVienSchema = new Schema({
    maNV: {
        type: String,
        unique: true,
        trim: true
    },
    hoTenNV: {
        type: String,
        required: [true, 'Họ tên không được để trống'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu không được để trống'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
    },
    chucVu: {
        type: String,
        enum: ['Admin', 'Nhân viên'],
        required: [true, 'Chức vụ không được để trống']
    },
    diaChi: {
        type: String,
        required: [true, 'Địa chỉ không được để trống'],
        trim: true
    },
    soDienThoai: {
        type: String,
        required: [true, 'Số điện thoại không được để trống'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email không được để trống'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email không hợp lệ']
    }
}, {
    timestamps: true
});

// Tự động tạo mã nhân viên và hash mật khẩu trước khi lưu
NhanVienSchema.pre('save', async function(next) {
    if (!this.maNV) {
        const count = await this.constructor.countDocuments();
        this.maNV = `NV${String(count + 1).padStart(5, '0')}`;
    }
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Phương thức so sánh mật khẩu
NhanVienSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const NhanVien = mongoose.model('NhanVien', NhanVienSchema);

module.exports = NhanVien; 