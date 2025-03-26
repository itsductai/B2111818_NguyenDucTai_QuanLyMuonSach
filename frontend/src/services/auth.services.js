import apiService from './api.service';

const authService = {
  // Đăng nhập độc giả
  loginDocGia(credentials) {
    return apiService.post('/doc-gia/login', credentials);
  },
  
  // Đăng nhập nhân viên
  loginNhanVien(credentials) {
    return apiService.post('/nhan-vien/login', credentials);
  },
  
  // Đăng ký độc giả
  registerDocGia(userData) {
    return apiService.post('/doc-gia/register', userData);
  },
  
  // Kiểm tra trạng thái đăng nhập
  checkAuth() {
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId');
    return !!userType && !!userId;
  },
  
  // Lấy thông tin người dùng hiện tại
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Lấy loại người dùng
  getUserType() {
    return localStorage.getItem('userType');
  },
  
  // Đăng xuất
  logout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
  }
};

export default authService;