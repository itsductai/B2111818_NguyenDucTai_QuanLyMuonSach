const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./NhaXuatBan.model'); // Import model NhaXuatBan

const SachSchema = new Schema({
    maSach: {
        type: String,
        unique: true,
        trim: true
    },
    tenSach: {
        type: String,
        required: [true, 'Tên sách không được để trống'],
        trim: true
    },
    donGia: {
        type: Number,
        required: [true, 'Đơn giá không được để trống'],
        min: [0, 'Đơn giá không được âm']
    },
    soQuyen: {
        type: Number,
        required: [true, 'Số quyển không được để trống'],
        min: [0, 'Số quyển không được âm']
    },
    namXuatBan: {
        type: Number,
        required: [true, 'Năm xuất bản không được để trống']
    },
    maNXB: {
        type: Schema.Types.ObjectId,
        ref: 'NhaXuatBan',
        required: [true, 'Mã nhà xuất bản không được để trống']
    },
    tacGia: {
        type: String,
        required: [true, 'Tác giả không được để trống'],
        trim: true
    },
    hinhAnh: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Tự động tạo mã sách trước khi lưu
SachSchema.pre('save', async function(next) {
    if (!this.maSach) {
        const count = await this.constructor.countDocuments();
        this.maSach = `SACH${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

// Tự động populate thông tin nhà xuất bản khi query
SachSchema.pre('find', function() {
    this.populate('maNXB');
});

const Sach = mongoose.model('Sach', SachSchema);

module.exports = Sach; 