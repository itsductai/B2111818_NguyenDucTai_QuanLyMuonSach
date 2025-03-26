import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để xử lý lỗi
apiService.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default apiService;