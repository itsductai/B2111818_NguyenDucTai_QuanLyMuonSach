import apiService from './api.service';

const nhaXuatBanService = {
  // Lấy danh sách nhà xuất bản
  getNhaXuatBans(params = {}) {
    return apiService.get('/nha-xuat-ban', { params });
  },
  
  // Lấy chi tiết nhà xuất bản
  getNhaXuatBan(id) {
    return apiService.get(`/nha-xuat-ban/${id}`);
  },
  
  // Thêm nhà xuất bản mới
  createNhaXuatBan(nhaXuatBanData) {
    return apiService.post('/nha-xuat-ban', nhaXuatBanData);
  },
  
  // Cập nhật nhà xuất bản
  updateNhaXuatBan(id, nhaXuatBanData) {
    return apiService.put(`/nha-xuat-ban/${id}`, nhaXuatBanData);
  },
  
  // Xóa nhà xuất bản
  deleteNhaXuatBan(id) {
    return apiService.delete(`/nha-xuat-ban/${id}`);
  }
};

export default nhaXuatBanService;