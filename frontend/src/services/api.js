import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API cho sách
export const sachAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/sach?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/sach/${id}`),
  create: (data) => api.post('/sach', data),
  update: (id, data) => api.put(`/sach/${id}`, data),
  delete: (id) => api.delete(`/sach/${id}`),
  getMostBorrowed: () => api.get('/sach/thong-ke-muon-nhieu')
}

// API cho nhà xuất bản
export const nhaXuatBanAPI = {
  getAll: () => api.get('/nhaxuatban'),
  getById: (id) => api.get(`/nhaxuatban/${id}`),
  create: (data) => api.post('/nhaxuatban', data),
  update: (id, data) => api.put(`/nhaxuatban/${id}`, data),
  delete: (id) => api.delete(`/nhaxuatban/${id}`)
}

// API cho độc giả
export const docGiaAPI = {
  getAll: () => api.get('/docgia'),
  getById: (id) => api.get(`/docgia/${id}`),
  create: (data) => api.post('/docgia', data),
  update: (id, data) => api.put(`/docgia/${id}`, data),
  delete: (id) => api.delete(`/docgia/${id}`)
}

// API cho nhân viên
export const nhanVienAPI = {
  getAll: () => api.get('/nhanvien'),
  getById: (id) => api.get(`/nhanvien/${id}`),
  create: (data) => api.post('/nhanvien', data),
  update: (id, data) => api.put(`/nhanvien/${id}`, data),
  delete: (id) => api.delete(`/nhanvien/${id}`)
}

// API cho theo dõi mượn sách
export const theoDoiMuonSachAPI = {
  getAll: () => api.get('/theodoimuonsach'),
  getById: (id) => api.get(`/theodoimuonsach/${id}`),
  create: (data) => api.post('/theodoimuonsach', data),
  update: (id, data) => api.put(`/theodoimuonsach/${id}`, data),
  delete: (id) => api.delete(`/theodoimuonsach/${id}`)
}

export default api 