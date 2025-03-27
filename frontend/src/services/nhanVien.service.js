import api from './api.service';

class NhanVienService {
  async getNhanViens(params = {}) {
    return api.get('/nhan-vien', { params });
  }

  async getNhanVien(id) {
    return api.get(`/nhan-vien/${id}`);
  }

  async createNhanVien(data) {
    return api.post('/nhan-vien/register', data);
  }

  async updateNhanVien(id, data) {
    return api.put(`/nhan-vien/${id}`, data);
  }

  async deleteNhanVien(id) {
    return api.delete(`/nhan-vien/${id}`);
  }
}

export default new NhanVienService();