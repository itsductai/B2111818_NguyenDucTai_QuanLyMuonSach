const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocGiaSchema = new Schema({
    maDocGia: {
        type: String,
        required: true,
        unique: true
    },
    hoLot: {
        type: String,
        required: true
    },
    ten: {
        type: String,
        required: true
    },
    ngaySinh: {
        type: Date,
        required: true
    },
    phai: {
        type: String,
        enum: ['Nam', 'Nữ', 'Khác'],
        required: true
    },
    diaChi: {
        type: String,
        required: true
    },
    dienThoai: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DocGia', DocGiaSchema); 