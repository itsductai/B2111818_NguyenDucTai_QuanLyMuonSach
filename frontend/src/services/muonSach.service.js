import apiService from './api.service';

const nhanVienService = {
  // Lấy danh sách nhân viên
  getNhanViens(params = {}) {
    return apiService.get('/nhan-vien', { params });
  },
  
  // Lấy chi tiết nhân viên
  getNhanVien(id) {
    return apiService.get(`/nhan-vien/${id}`);
  },
  
  // Thêm nhân viên mới
  createNhanVien(nhanVienData) {
    return apiService.post('/nhan-vien/register', nhanVienData);
  },
  
  // Cập nhật thông tin nhân viên
  updateNhanVien(id, nhanVienData) {
    return apiService.put(`/nhan-vien/${id}`, nhanVienData);
  },
  
  // Xóa nhân viên
  deleteNhanVien(id) {
    return apiService.delete(`/nhan-vien/${id}`);
  }
};

export default nhanVienService;