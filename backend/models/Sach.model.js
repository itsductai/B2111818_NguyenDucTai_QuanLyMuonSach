const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SachSchema = new Schema({
    maSach: {
        type: String,
        required: true,
        unique: true
    },
    tenSach: {
        type: String,
        required: true
    },
    donGia: {
        type: Number,
        required: true,
        min: 0
    },
    soQuyen: {
        type: Number,
        required: true,
        min: 0
    },
    namXuatBan: {
        type: Number,
        required: true
    },
    maNXB: {
        type: Schema.Types.ObjectId,
        ref: 'NhaXuatBan',
        required: true
    },
    nguonGoc: {
        type: String,
        enum: ['Mua', 'Tặng', 'Tác giả'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sach', SachSchema); 