const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const NhanVienSchema = new Schema({
    maNV: {
        type: String,
        required: true,
        unique: true
    },
    hoTenNV: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    chucVu: {
        type: String,
        enum: ['Admin', 'Nhân viên'],
        required: true
    },
    diaChi: {
        type: String,
        required: true
    },
    soDienThoai: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Hash mật khẩu trước khi lưu
NhanVienSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Phương thức kiểm tra mật khẩu
NhanVienSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('NhanVien', NhanVienSchema); 