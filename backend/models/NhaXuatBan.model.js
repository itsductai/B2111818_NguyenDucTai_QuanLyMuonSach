const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NhaXuatBanSchema = new Schema({
    maNXB: {
        type: String,
        required: true,
        unique: true
    },
    tenNXB: {
        type: String,
        required: true
    },
    diaChi: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NhaXuatBan', NhaXuatBanSchema); 