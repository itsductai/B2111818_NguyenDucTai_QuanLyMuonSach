const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Kết nối database thành công!');
    } catch (error) {
        console.error('Lỗi kết nối database:', error);
    }
}

module.exports = { connect }; 