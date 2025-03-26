import apiService from './api.service';

const docGiaService = {
  // Lấy danh sách độc giả
  getDocGias(params = {}) {
    return apiService.get('/doc-gia', { params });
  },
  
  // Lấy chi tiết độc giả
  getDocGia(id) {
    return apiService.get(`/doc-gia/${id}`);
  },
  
  // Cập nhật thông tin độc giả
  updateDocGia(id, docGiaData) {
    return apiService.put(`/doc-gia/${id}`, docGiaData);
  },
  
  // Khóa/mở khóa tài khoản độc giả
  updateTrangThai(id) {
    return apiService.patch(`/doc-gia/${id}/trang-thai`);
  },
  
  // Xóa độc giả
  deleteDocGia(id) {
    return apiService.delete(`/doc-gia/${id}`);
  }
};

export default docGiaService;