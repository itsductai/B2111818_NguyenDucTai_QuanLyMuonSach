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
export const sachService = {
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/sach?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sách:', error)
      throw error
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/sach', data)
      return response.data
    } catch (error) {
      console.error('Lỗi khi thêm sách:', error)
      throw error
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/sach/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Lỗi khi cập nhật sách:', error)
      throw error
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/sach/${id}`)
      return response.data
    } catch (error) {
      console.error('Lỗi khi xóa sách:', error)
      throw error
    }
  }
}

// API cho nhà xuất bản
export const nhaXuatBanService = {
  getAll: async () => {
    try {
      const response = await api.get('/nhaxuatban')
      return response.data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhà xuất bản:', error)
      throw error
    }
  }
}

export default api 