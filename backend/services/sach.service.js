const Sach = require('../models/Sach.model');

class SachService {
    /**
     * Lấy danh sách tất cả sách
     * @param {Object} filter - Điều kiện lọc (tên sách, nhà xuất bản, etc.)
     * @param {Object} options - Tùy chọn phân trang
     * @returns {Promise<Object>} Danh sách sách và tổng số
     */
    async getAllSach(filter = {}, options = { page: 1, limit: 10 }) {
        try {
            const { page, limit } = options;
            const skip = (page - 1) * limit;

            // Xây dựng query
            const query = {};
            if (filter.tenSach) {
                query.tenSach = { $regex: filter.tenSach, $options: 'i' };
            }
            if (filter.maNXB) {
                query.maNXB = filter.maNXB;
            }

            // Thực hiện truy vấn với populate nhà xuất bản
            const [sach, totalSach] = await Promise.all([
                Sach.find(query)
                    .populate('maNXB', 'tenNXB')
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Sach.countDocuments(query)
            ]);

            return {
                sach,
                totalSach,
                currentPage: page,
                totalPages: Math.ceil(totalSach / limit)
            };
        } catch (error) {
            throw new Error('Lỗi khi lấy danh sách sách: ' + error.message);
        }
    }

    /**
     * Tìm sách theo ID
     * @param {string} id - ID của sách
     * @returns {Promise<Object>} Thông tin sách
     */
    async getSachById(id) {
        try {
            const sach = await Sach.findById(id).populate('maNXB', 'tenNXB');
            if (!sach) {
                throw new Error('Không tìm thấy sách');
            }
            return sach;
        } catch (error) {
            throw new Error('Lỗi khi tìm sách: ' + error.message);
        }
    }

    /**
     * Tạo sách mới
     * @param {Object} sachData - Thông tin sách
     * @returns {Promise<Object>} Sách đã tạo
     */
    async createSach(sachData) {
        try {
            const sach = new Sach(sachData);
            await sach.save();
            return sach;
        } catch (error) {
            throw new Error('Lỗi khi tạo sách: ' + error.message);
        }
    }

    /**
     * Cập nhật thông tin sách
     * @param {string} id - ID của sách
     * @param {Object} sachData - Thông tin cập nhật
     * @returns {Promise<Object>} Sách đã cập nhật
     */
    async updateSach(id, sachData) {
        try {
            const sach = await Sach.findByIdAndUpdate(
                id,
                sachData,
                { new: true, runValidators: true }
            );
            if (!sach) {
                throw new Error('Không tìm thấy sách');
            }
            return sach;
        } catch (error) {
            throw new Error('Lỗi khi cập nhật sách: ' + error.message);
        }
    }

    /**
     * Xóa sách
     * @param {string} id - ID của sách
     * @returns {Promise<Object>} Kết quả xóa
     */
    async deleteSach(id) {
        try {
            const sach = await Sach.findByIdAndDelete(id);
            if (!sach) {
                throw new Error('Không tìm thấy sách');
            }
            return { message: 'Xóa sách thành công' };
        } catch (error) {
            throw new Error('Lỗi khi xóa sách: ' + error.message);
        }
    }

    /**
     * Cập nhật số lượng sách
     * @param {string} id - ID của sách
     * @param {number} soLuong - Số lượng thay đổi (dương: tăng, âm: giảm)
     * @returns {Promise<Object>} Sách đã cập nhật
     */
    async updateSoLuong(id, soLuong) {
        try {
            const sach = await Sach.findById(id);
            if (!sach) {
                throw new Error('Không tìm thấy sách');
            }

            // Kiểm tra số lượng hợp lệ
            const soQuyenMoi = sach.soQuyen + soLuong;
            if (soQuyenMoi < 0) {
                throw new Error('Số lượng sách không đủ');
            }

            sach.soQuyen = soQuyenMoi;
            await sach.save();
            return sach;
        } catch (error) {
            throw new Error('Lỗi khi cập nhật số lượng sách: ' + error.message);
        }
    }

    /**
     * Thống kê sách được mượn nhiều nhất
     * @param {number} limit - Số lượng sách muốn lấy
     * @returns {Promise<Array>} Danh sách sách và số lượt mượn
     */
    async getSachMuonNhieuNhat(limit = 10) {
        try {
            const thongKe = await Sach.aggregate([
                {
                    $lookup: {
                        from: 'theodoimuonsaches',
                        localField: '_id',
                        foreignField: 'maSach',
                        as: 'luotMuon'
                    }
                },
                {
                    $project: {
                        tenSach: 1,
                        soLuotMuon: { $size: '$luotMuon' }
                    }
                },
                { $sort: { soLuotMuon: -1 } },
                { $limit: limit }
            ]);
            return thongKe;
        } catch (error) {
            throw new Error('Lỗi khi thống kê sách: ' + error.message);
        }
    }
}

module.exports = new SachService(); 