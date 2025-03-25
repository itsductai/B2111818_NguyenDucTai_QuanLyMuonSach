const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TheoDoiMuonSachSchema = new Schema({
    maDocGia: {
        type: Schema.Types.ObjectId,
        ref: 'DocGia',
        required: true
    },
    maSach: {
        type: Schema.Types.ObjectId,
        ref: 'Sach',
        required: true
    },
    ngayMuon: {
        type: Date,
        required: true,
        default: Date.now
    },
    ngayTra: {
        type: Date
    },
    trangThai: {
        type: String,
        enum: ['Đang mượn', 'Đã trả', 'Quá hạn'],
        default: 'Đang mượn'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TheoDoiMuonSach', TheoDoiMuonSachSchema); 