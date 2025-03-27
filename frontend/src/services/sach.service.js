import apiService from './api.service';

const sachService = {
  // Lấy danh sách sách
  getSachs(params = {}) {
    return apiService.get('/sach', { params });
  },
  
  // Tìm kiếm sách
  searchSachs(keyword) {
    return apiService.get(`/sach/search?q=${keyword}`);
  },
  
  // Lấy chi tiết sách
  getSach(id) {
    return apiService.get(`/sach/${id}`);
  },
  
  // Thêm sách mới
  createSach(sachData) {
    return apiService.post('/sach', sachData);
  },
  
  // Cập nhật sách
  updateSach(id, sachData) {
    return apiService.put(`/sach/${id}`, sachData);
  },
  
  // Xóa sách
  deleteSach(id) {
    return apiService.delete(`/sach/${id}`);
  },
  
  // Cập nhật số lượng sách
  updateSoLuong(id, soQuyen) {
    return apiService.patch(`/sach/${id}/so-luong`, { soQuyen });
  },
  
  // Thống kê sách mượn nhiều nhất
  getSachMuonNhieuNhat() {
    return apiService.get('/sach/thong-ke/muon-nhieu-nhat');
  }
};

export default sachService;