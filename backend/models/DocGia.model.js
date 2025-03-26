const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const DocGiaSchema = new Schema({
    maDocGia: {
        type: String,
        unique: true,
        trim: true
    },
    hoLot: {
        type: String,
        required: [true, 'Họ lót không được để trống'],
        trim: true
    },
    ten: {
        type: String,
        required: [true, 'Tên không được để trống'],
        trim: true
    },
    ngaySinh: {
        type: Date,
        required: [true, 'Ngày sinh không được để trống']
    },
    phai: {
        type: String,
        enum: ['Nam', 'Nữ'],
        required: [true, 'Giới tính không được để trống']
    },
    diaChi: {
        type: String,
        required: [true, 'Địa chỉ không được để trống'],
        trim: true
    },
    dienThoai: {
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
    },
    matKhau: {
        type: String,
        required: [true, 'Mật khẩu không được để trống'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự']
    },
    ngayDangKy: {
        type: Date,
        default: Date.now
    },
    trangThai: {
        type: String,
        enum: ['Hoạt động', 'Bị khóa'],
        default: 'Hoạt động'
    }
}, {
    timestamps: true
});

// Tự động tạo mã độc giả trước khi lưu
DocGiaSchema.pre('save', async function(next) {
    if (!this.maDocGia) {
        const count = await this.constructor.countDocuments();
        this.maDocGia = `DG${String(count + 1).padStart(5, '0')}`;
    }
    if (this.isModified('matKhau')) {
        const salt = await bcrypt.genSalt(10);
        this.matKhau = await bcrypt.hash(this.matKhau, salt);
    }
    next();
});

// Phương thức so sánh mật khẩu
DocGiaSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.matKhau);
};

const DocGia = mongoose.model('DocGia', DocGiaSchema);

module.exports = DocGia; 