const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NhaXuatBanSchema = new Schema({
    maNXB: {
        type: String,
        required: [true, 'Mã nhà xuất bản không được để trống'],
        unique: true,
        trim: true
    },
    tenNXB: {
        type: String,
        required: [true, 'Tên nhà xuất bản không được để trống'],
        trim: true
    },
    diaChi: {
        type: String,
        required: [true, 'Địa chỉ không được để trống'],
        trim: true
    }
}, {
    timestamps: true
});

// Tự động tạo mã nhà xuất bản trước khi lưu
NhaXuatBanSchema.pre('save', async function(next) {
    if (!this.maNXB) {
        const count = await this.constructor.countDocuments();
        this.maNXB = `NXB${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

const NhaXuatBan = mongoose.model('NhaXuatBan', NhaXuatBanSchema);

module.exports = NhaXuatBan; 