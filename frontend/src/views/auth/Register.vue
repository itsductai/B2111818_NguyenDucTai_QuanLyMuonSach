<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title gradient-text">Đăng ký</h1>
        <p class="auth-subtitle">Tạo tài khoản độc giả mới</p>
      </div>
      
      <div class="alert alert-error" v-if="error">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="hoLot">Họ lót</label>
            <input 
              type="text" 
              id="hoLot" 
              class="form-control" 
              v-model="formData.hoLot" 
              required
              placeholder="Nhập họ lót"
            />
          </div>
          
          <div class="form-group">
            <label for="ten">Tên</label>
            <input 
              type="text" 
              id="ten" 
              class="form-control" 
              v-model="formData.ten" 
              required
              placeholder="Nhập tên"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="ngaySinh">Ngày sinh</label>
            <input 
              type="date" 
              id="ngaySinh" 
              class="form-control" 
              v-model="formData.ngaySinh" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="phai">Giới tính</label>
            <select id="phai" class="form-control" v-model="formData.phai" required>
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="diaChi">Địa chỉ</label>
          <input 
            type="text" 
            id="diaChi" 
            class="form-control" 
            v-model="formData.diaChi" 
            required
            placeholder="Nhập địa chỉ"
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="dienThoai">Số điện thoại</label>
            <input 
              type="tel" 
              id="dienThoai" 
              class="form-control" 
              v-model="formData.dienThoai" 
              required
              placeholder="Nhập số điện thoại"
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              v-model="formData.email" 
              required
              placeholder="Nhập email"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="matKhau">Mật khẩu</label>
            <div class="password-input">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="matKhau" 
                class="form-control" 
                v-model="formData.matKhau" 
                required
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                minlength="6"
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
          
          <div class="form-group">
            <label for="confirmPassword">Xác nhận mật khẩu</label>
            <div class="password-input">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                class="form-control" 
                v-model="confirmPassword" 
                required
                placeholder="Nhập lại mật khẩu"
                minlength="6"
              />
              <button 
                type="button" 
                class="password-toggle" 
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i class="fas" :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">Đang đăng ký...</span>
            <span v-else>Đăng ký</span>
          </button>
        </div>
      </form>
      
      <div class="auth-footer">
        <p>Đã có tài khoản? <router-link to="/login" class="gradient-text">Đăng nhập</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.services';

const router = useRouter();
const formData = reactive({
  hoLot: '',
  ten: '',
  ngaySinh: '',
  phai: '',
  diaChi: '',
  dienThoai: '',
  email: '',
  matKhau: '',
  ngayDangKy: new Date().toISOString().split('T')[0],
  trangThai: 'Hoạt động'
});

const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  try {
    // Kiểm tra mật khẩu xác nhận
    if (formData.matKhau !== confirmPassword.value) {
      error.value = 'Mật khẩu xác nhận không khớp';
      return;
    }
    
    loading.value = true;
    error.value = '';
    
    const response = await authService.registerDocGia(formData);
    
    if (response.message) {
      // Chuyển hướng đến trang đăng nhập
      router.push('/login');
    }
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    error.value = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
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
  padding: 2rem 0;
}

.auth-card {
  width: 100%;
  max-width: 600px;
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

.auth-form {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0;
}

.form-row .form-group {
  flex: 1;
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

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>