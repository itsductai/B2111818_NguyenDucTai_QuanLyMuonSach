import api from './api.service';

class DocGiaService {
  async getDocGias(params = {}) {
    return api.get('/doc-gia', { params });
  }

  async getDocGia(id) {
    return api.get(`/doc-gia/${id}`);
  }

  async createDocGia(data) {
    return api.post('/doc-gia', data);
  }

  async updateDocGia(id, data) {
    return api.put(`/doc-gia/${id}`, data);
  }

  async deleteDocGia(id) {
    return api.delete(`/doc-gia/${id}`);
  }

  async toggleDocGiaStatus(id) {
    return api.patch(`/doc-gia/${id}/trang-thai`);
  }
}

export default new DocGiaService();