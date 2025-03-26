const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TheoDoiMuonSachSchema = new Schema({
    maDocGia: {
        type: Schema.Types.ObjectId,
        ref: 'DocGia',
        required: [true, 'Mã độc giả không được để trống']
    },
    maSach: {
        type: Schema.Types.ObjectId,
        ref: 'Sach',
        required: [true, 'Mã sách không được để trống']
    },
    ngayMuon: {
        type: Date,
        required: [true, 'Ngày mượn không được để trống'],
        default: Date.now
    },
    ngayTra: {
        type: Date
    }
}, {
    timestamps: true
});

const TheoDoiMuonSach = mongoose.model('TheoDoiMuonSach', TheoDoiMuonSachSchema);

module.exports = TheoDoiMuonSach; 