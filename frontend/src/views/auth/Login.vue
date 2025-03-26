<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title gradient-text">Đăng nhập</h1>
        <p class="auth-subtitle">Vui lòng đăng nhập để tiếp tục</p>
      </div>
      
      <div class="auth-tabs">
        <button 
          class="auth-tab" 
          :class="{ active: userType === 'DocGia' }" 
          @click="userType = 'DocGia'"
        >
          Độc giả
        </button>
        <button 
          class="auth-tab" 
          :class="{ active: userType === 'NhanVien' }" 
          @click="userType = 'NhanVien'"
        >
          Nhân viên
        </button>
      </div>
      
      <div class="alert alert-error" v-if="error">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            class="form-control" 
            v-model="email" 
            required
            placeholder="Nhập email của bạn"
          />
        </div>
        
        <div class="form-group">
          <label for="matKhau">Mật khẩu</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="matKhau" 
              class="form-control" 
              v-model="matKhau" 
              required
              placeholder="Nhập mật khẩu của bạn"
            />
            <button 
              type="button" 
              class="password-toggle" 
              @click="showPassword = !showPassword"
            >
              <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
            </button>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">Đang đăng nhập...</span>
            <span v-else>Đăng nhập</span>
          </button>
        </div>
      </form>
      
      <div class="auth-footer" v-if="userType === 'DocGia'">
        <p>Chưa có tài khoản? <router-link to="/register" class="gradient-text">Đăng ký</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.services';

const router = useRouter();
const email = ref('');
const matKhau = ref('');
const userType = ref('DocGia');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    let response;
    if (userType.value === 'DocGia') {
      response = await authService.loginDocGia({
        email: email.value,
        matKhau: matKhau.value
      });
      
      if (response.message) {
        localStorage.setItem('userType', 'DocGia');
        localStorage.setItem('userId', response.docGia._id);
        localStorage.setItem('user', JSON.stringify(response.docGia));
      }
    } else {
      response = await authService.loginNhanVien({
        email: email.value,
        matKhau: matKhau.value
      });
      
      if (response.message) {
        localStorage.setItem('userType', 'NhanVien');
        localStorage.setItem('userId', response.nhanVien._id);
        localStorage.setItem('user', JSON.stringify(response.nhanVien));
      }
    }
    
    // Chuyển hướng đến trang dashboard
    router.push('/dashboard');
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    error.value = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(3, 78, 162, 0.1), rgba(241, 0, 128, 0.1));
}

.auth-card {
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--shadow);
  padding: 2rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #666;
}

.auth-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.auth-tab {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.auth-tab.active {
  border-bottom: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.auth-form {
  margin-bottom: 1.5rem;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.form-actions {
  margin-top: 1.5rem;
}

.form-actions .btn {
  width: 100%;
  padding: 10px;
}

.auth-footer {
  text-align: center;
  margin-top: 1rem;
  font-size: 14px;
}

.auth-footer a {
  text-decoration: none;
  font-weight: 500;
}
</style>