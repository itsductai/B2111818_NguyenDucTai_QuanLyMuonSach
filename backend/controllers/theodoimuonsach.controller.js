const TheoDoiMuonSach = require('../models/TheoDoiMuonSach.model');
const Sach = require('../models/Sach.model');
const NhanVien = require('../models/NhanVien.model');

// Lấy danh sách theo dõi mượn sách
exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const theoDoiMuonSach = await TheoDoiMuonSach.find()
            .populate('maDocGia', 'maDocGia hoLot ten email')
            .populate('maSach', 'maSach tenSach tacGia soQuyen')
            .sort({ ngayMuon: -1 })
            .skip(skip)
            .limit(limit);

        const total = await TheoDoiMuonSach.countDocuments();

        res.json({
            message: 'Lấy danh sách theo dõi mượn sách thành công',
            theoDoiMuonSach,
            total,
            page,
            limit
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// controllers/theodoimuonsach.controller.js
exports.getByDocGiaId = async (req, res) => {
  try {
    const maDocGia = req.params.maDocGia;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const records = await TheoDoiMuonSach.find({ maDocGia })
      .populate('maDocGia', 'maDocGia hoLot ten email')
      .populate('maSach', 'maSach tenSach tacGia soQuyen')
      .skip(skip)
      .limit(limit);

    const total = await TheoDoiMuonSach.countDocuments({ maDocGia });

    res.json({
      message: 'Lấy danh sách phiếu mượn theo độc giả thành công',
      theoDoiMuonSach: records,
      total,
      page,
      limit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Lấy thông tin một bản ghi theo dõi mượn sách
exports.getById = async (req, res) => {
    try {
        const theoDoiMuonSach = await TheoDoiMuonSach.findById(req.params._id)
            .populate('maDocGia', 'maDocGia hoLot ten email')
            .populate('maSach', 'maSach tenSach tacGia soQuyen');

        if (!theoDoiMuonSach) {
            return res.status(404).json({ message: 'Không tìm thấy bản ghi theo dõi mượn sách' });
        }

        res.json({
            message: 'Lấy thông tin theo dõi mượn sách thành công',
            theoDoiMuonSach
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm bản ghi theo dõi mượn sách mới
exports.create = async (req, res) => {
    try {
        const sach = await Sach.findById(req.body.maSach);
        if (!sach) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        if (sach.soQuyen <= 0) {
            return res.status(400).json({ message: 'Sách đã hết' });
        }

        const theoDoiMuonSach = new TheoDoiMuonSach(req.body);
        const newTheoDoiMuonSach = await theoDoiMuonSach.save();

        // Giảm số lượng sách
        sach.soQuyen -= 1;
        await sach.save();

        res.status(201).json({
            message: 'Thêm bản ghi theo dõi mượn sách thành công',
            theoDoiMuonSach: newTheoDoiMuonSach
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Duyệt phiếu mượn sách
exports.approveMuonSach = async (req, res) => {
    try {
        const { maNV } = req.body;
        const muonSach = await TheoDoiMuonSach.findById(req.params._id);
        const nhanVien = await NhanVien.findById(maNV);

        if (!muonSach) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
        }

        if (muonSach.tinhTrang !== 'Chưa duyệt') {
            return res.status(400).json({ message: 'Phiếu mượn đã được duyệt hoặc đã trả' });
        }

        if (!nhanVien) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên duyệt' });
        }

        muonSach.tinhTrang = 'Đã duyệt';
        muonSach.maNV = maNV;

        await muonSach.save();

        res.json({
            message: 'Duyệt phiếu mượn thành công',
            muonSach
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Cập nhật ngày trả sách
exports.update = async (req, res) => {
    try {
        const theoDoiMuonSach = await TheoDoiMuonSach.findById(req.params._id);
        if (!theoDoiMuonSach) {
            return res.status(404).json({ message: 'Không tìm thấy bản ghi theo dõi mượn sách' });
        }

        if (theoDoiMuonSach.ngayTra) {
            return res.status(400).json({ message: 'Sách đã được trả' });
        }

        theoDoiMuonSach.ngayTra = new Date();
        theoDoiMuonSach.tinhTrang = 'Đã trả';
        await theoDoiMuonSach.save();

        const sach = await Sach.findById(theoDoiMuonSach.maSach);
        sach.soQuyen += 1;
        await sach.save();

        res.json({
            message: 'Cập nhật ngày trả sách thành công',
            theoDoiMuonSach
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Trả sách từ phía độc giả
exports.returnSachByDocGia = async (req, res) => {
  try {
    const muonSach = await TheoDoiMuonSach.findById(req.params._id);

    if (!muonSach) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
    }

    if (muonSach.tinhTrang === 'Đã trả') {
      return res.status(400).json({ message: 'Sách đã được trả' });
    }

    // Cập nhật tình trạng và ngày trả
    muonSach.tinhTrang = 'Đã trả';
    muonSach.ngayTraThucTe = new Date();
    await muonSach.save();

    // Tăng số lượng sách trong kho
    const sach = await Sach.findById(muonSach.maSach);
    if (sach) {
      sach.soQuyen += 1;
      await sach.save();
    }

    res.json({
      message: 'Trả sách thành công',
      muonSach
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Xóa bản ghi theo dõi mượn sách
exports.delete = async (req, res) => {
    try {
        const theoDoiMuonSach = await TheoDoiMuonSach.findById(req.params._id);
        if (!theoDoiMuonSach) {
            return res.status(404).json({ message: 'Không tìm thấy bản ghi theo dõi mượn sách' });
        }

        // Nếu chưa trả sách, tăng số lượng sách
        if (!theoDoiMuonSach.ngayTra) {
            const sach = await Sach.findById(theoDoiMuonSach.maSach);
            sach.soQuyen += 1;
            await sach.save();
        }

        await theoDoiMuonSach.deleteOne();
        res.json({ message: 'Xóa bản ghi theo dõi mượn sách thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};