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
    maNV: {
        type: Schema.Types.ObjectId,
        ref: 'NhanVien',
        default: null // Nhân viên duyệt mượn, ban đầu chưa có
    },
    ngayMuon: {
        type: Date,
        default: Date.now
    },
    ngayTra: {
        type: Date
    },
    tinhTrang: {
        type: String,
        enum: ['Chưa duyệt', 'Đã duyệt', 'Đã trả'],
        default: 'Chưa duyệt'
    }
}, {
    timestamps: true
});


const TheoDoiMuonSach = mongoose.model('TheoDoiMuonSach', TheoDoiMuonSachSchema);

module.exports = TheoDoiMuonSach; 