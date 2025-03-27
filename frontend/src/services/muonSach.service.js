import api from './api.service';

class MuonSachService {
  async getMuonSachs(params = {}) {
    return api.get('/muon-sach', { params });
  }

  async getMuonSach(id) {
    return api.get(`/muon-sach/${id}`);
  }

  async createMuonSach(data) {
    return api.post('/muon-sach', data);
  }

  async updateMuonSach(id, data) {
    return api.put(`/muon-sach/${id}`, data);
  }

  async deleteMuonSach(id) {
    return api.delete(`/muon-sach/${id}`);
  }

  async getDocGiaMuonSachs(docGiaId) {
    return api.get(`/muon-sach/doc-gia/${docGiaId}`);
  }

  async approveMuonSach(id, data) {
    return api.patch(`/muon-sach/${id}/duyet`, data);
  }

  async returnMuonSach(id) {
    return api.patch(`/muon-sach/doc-gia/trasach/${id}`);
  }
}

export default new MuonSachService();