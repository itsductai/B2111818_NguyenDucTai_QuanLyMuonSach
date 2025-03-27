<template>
  <Layout page-title="Thông tin cá nhân">
    <div class="profile-container">
      <div class="card profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <div class="avatar-large">{{ userInitials }}</div>
          </div>
          <div class="profile-info">
            <h2 class="profile-name">{{ displayName }}</h2>
            <p class="profile-role">{{ userRole }}</p>
          </div>
        </div>
        
        <div class="alert alert-error" v-if="error">{{ error }}</div>
        <div class="alert alert-success" v-if="success">{{ success }}</div>
        
        <form @submit.prevent="updateProfile" class="profile-form">
          <!-- Form cho Độc giả -->
          <template v-if="userType === 'DocGia'">
            <div class="form-row">
              <div class="form-group">
                <label for="hoLot">Họ lót</label>
                <input type="text" id="hoLot" class="form-control" v-model="formData.hoLot" required />
              </div>
              <div class="form-group">
                <label for="ten">Tên</label>
                <input type="text" id="ten" class="form-control" v-model="formData.ten" required />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="ngaySinh">Ngày sinh</label>
                <input type="date" id="ngaySinh" class="form-control" v-model="formData.ngaySinh" required />
              </div>
              <div class="form-group">
                <label for="phai">Giới tính</label>
                <select id="phai" class="form-control" v-model="formData.phai" required>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label for="diaChi">Địa chỉ</label>
              <input type="text" id="diaChi" class="form-control" v-model="formData.diaChi" required />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="dienThoai">Số điện thoại</label>
                <input type="tel" id="dienThoai" class="form-control" v-model="formData.dienThoai" required />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control" v-model="formData.email" required readonly />
              </div>
            </div>
            
            <div class="form-group">
              <label for="ngayDangKy">Ngày đăng ký</label>
              <input type="date" id="ngayDangKy" class="form-control" v-model="formData.ngayDangKy" readonly />
            </div>
          </template>
          
          <!-- Form cho Nhân viên -->
          <template v-else-if="userType === 'NhanVien'">
            <div class="form-group">
              <label for="hoTenNV">Họ tên</label>
              <input type="text" id="hoTenNV" class="form-control" v-model="formData.hoTenNV" required />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control" v-model="formData.email" required readonly />
              </div>
              <div class="form-group">
                <label for="chucVu">Chức vụ</label>
                <input type="text" id="chucVu" class="form-control" v-model="formData.chucVu" readonly />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="diaChi">Địa chỉ</label>
                <input type="text" id="diaChi" class="form-control" v-model="formData.diaChi" required />
              </div>
              <div class="form-group">
                <label for="soDienThoai">Số điện thoại</label>
                <input type="tel" id="soDienThoai" class="form-control" v-model="formData.soDienThoai" required />
              </div>
            </div>
          </template>
          
          <div class="form-divider"></div>
          
          <div class="form-group">
            <label for="matKhau">Mật khẩu mới (để trống nếu không đổi)</label>
            <div class="password-input">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="matKhau" 
                class="form-control" 
                v-model="formData.matKhau" 
                placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
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
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading">Đang cập nhật...</span>
              <span v-else>Cập nhật thông tin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import Layout from '@/components/common/Layout.vue';
import authService from '@/services/auth.services';
import docGiaService from '@/services/docGia.service';
import nhanVienService from '@/services/nhanVien.service';

const userType = computed(() => {
  return authService.getUserType();
});

const userId = computed(() => {
  return localStorage.getItem('userId');
});

const formData = reactive({
  // Độc giả
  hoLot: '',
  ten: '',
  ngaySinh: '',
  phai: '',
  diaChi: '',
  dienThoai: '',
  email: '',
  ngayDangKy: '',
  
  // Nhân viên
  hoTenNV: '',
  chucVu: '',
  soDienThoai: '',
  
  // Chung
  matKhau: ''
});

const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');

const userInitials = computed(() => {
  if (userType.value === 'DocGia' && formData.ten) {
    return formData.ten.charAt(0);
  } else if (formData.hoTenNV) {
    const nameParts = formData.hoTenNV.split(' ');
    return nameParts[nameParts.length - 1].charAt(0);
  }
  return 'U';
});

const displayName = computed(() => {
  if (userType.value === 'DocGia') {
    return `${formData.hoLot} ${formData.ten}`;
  } else {
    return formData.hoTenNV;
  }
});

const userRole = computed(() => {
  if (userType.value === 'DocGia') {
    return 'Độc giả';
  } else {
    return formData.chucVu === 'Admin' ? 'Quản trị viên' : 'Nhân viên';
  }
});

onMounted(async () => {
  try {
    loading.value = true;
    
    if (userType.value === 'DocGia') {
      const response = await docGiaService.getDocGia(userId.value);
      const docGia = response.docGia;
      
      formData.hoLot = docGia.hoLot || '';
      formData.ten = docGia.ten || '';
      formData.ngaySinh = docGia.ngaySinh ? new Date(docGia.ngaySinh).toISOString().split('T')[0] : '';
      formData.phai = docGia.phai || '';
      formData.diaChi = docGia.diaChi || '';
      formData.dienThoai = docGia.dienThoai || '';
      formData.email = docGia.email || '';
      formData.ngayDangKy = docGia.ngayDangKy ? new Date(docGia.ngayDangKy).toISOString().split('T')[0] : '';
    } else {
      const response = await nhanVienService.getNhanVien(userId.value);
      const nhanVien = response.nhanVien;
      
      formData.hoTenNV = nhanVien.hoTenNV || '';
      formData.email = nhanVien.email || '';
      formData.chucVu = nhanVien.chucVu || '';
      formData.diaChi = nhanVien.diaChi || '';
      formData.soDienThoai = nhanVien.soDienThoai || '';
    }
  } catch (err) {
    console.error('Lỗi khi tải thông tin người dùng:', err);
    error.value = 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
});

const updateProfile = async () => {
  try {
    loading.value = true;
    error.value = '';
    success.value = '';
    
    const updateData = { ...formData };
    
    // Xóa trường mật khẩu nếu không có thay đổi
    if (!updateData.matKhau) {
      delete updateData.matKhau;
    }
    
    if (userType.value === 'DocGia') {
      // Xóa các trường không cần thiết cho độc giả
      delete updateData.hoTenNV;
      delete updateData.chucVu;
      delete updateData.soDienThoai;
      
      await docGiaService.updateDocGia(userId.value, updateData);
    } else {
      // Xóa các trường không cần thiết cho nhân viên
      delete updateData.hoLot;
      delete updateData.ten;
      delete updateData.ngaySinh;
      delete updateData.phai;
      delete updateData.dienThoai;
      delete updateData.ngayDangKy;
      
      await nhanVienService.updateNhanVien(userId.value, updateData);
    }
    
    // Cập nhật thông tin người dùng trong localStorage
    const user = authService.getCurrentUser();
    if (userType.value === 'DocGia') {
      user.hoLot = formData.hoLot;
      user.ten = formData.ten;
    } else {
      user.hoTenNV = formData.hoTenNV;
    }
    localStorage.setItem('user', JSON.stringify(user));
    
    success.value = 'Cập nhật thông tin thành công!';
  } catch (err) {
    console.error('Lỗi khi cập nhật thông tin:', err);
    error.value = err.response?.data?.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-card {
  padding: 2rem;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-avatar {
  margin-right: 1.5rem;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.profile-role {
  color: #666;
  font-size: 1rem;
}

.form-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 1.5rem 0;
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
  display: flex;
  justify-content: flex-end;
}

.form-actions .btn {
  min-width: 150px;
}
</style>