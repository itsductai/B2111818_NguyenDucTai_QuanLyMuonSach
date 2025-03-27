<template>
  <Layout :page-title="isEditMode ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'">
    <div class="staff-form-container">
      <div class="card">
        <div class="card-body">
          <div class="alert alert-info" v-if="loading">
            <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
          </div>
          
          <div class="alert alert-error" v-if="error">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>
          
          <form @submit.prevent="saveStaff" v-if="!loading">
            <div class="form-group">
              <label for="hoTenNV">Họ tên <span class="required">*</span></label>
              <input 
                type="text" 
                id="hoTenNV" 
                class="form-control" 
                v-model="formData.hoTenNV" 
                required
                placeholder="Nhập họ tên nhân viên"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="email">Email <span class="required">*</span></label>
                <input 
                  type="email" 
                  id="email" 
                  class="form-control" 
                  v-model="formData.email" 
                  required
                  placeholder="Nhập email"
                  :disabled="isEditMode"
                />
                <small class="form-text" v-if="isEditMode">Email không thể thay đổi sau khi tạo</small>
              </div>
              
              <div class="form-group">
                <label for="chucVu">Chức vụ <span class="required">*</span></label>
                <select id="chucVu" class="form-control" v-model="formData.chucVu" required>
                  <option value="Admin">Admin</option>
                  <option value="Nhân viên">Nhân viên</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="diaChi">Địa chỉ <span class="required">*</span></label>
                <input 
                  type="text" 
                  id="diaChi" 
                  class="form-control" 
                  v-model="formData.diaChi" 
                  required
                  placeholder="Nhập địa chỉ"
                />
              </div>
              
              <div class="form-group">
                <label for="soDienThoai">Số điện thoại <span class="required">*</span></label>
                <input 
                  type="tel" 
                  id="soDienThoai" 
                  class="form-control" 
                  v-model="formData.soDienThoai" 
                  required
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="matKhau">
                {{ isEditMode ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu' }}
                <span class="required" v-if="!isEditMode">*</span>
              </label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="matKhau" 
                  class="form-control" 
                  v-model="formData.matKhau" 
                  :required="!isEditMode"
                  :placeholder="isEditMode ? 'Nhập mật khẩu mới nếu muốn thay đổi' : 'Nhập mật khẩu'"
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
              <router-link to="/quan-ly/nhan-vien" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Quay lại
              </router-link>
              <button type="submit" class="btn btn-primary" :disabled="saveLoading">
                <i class="fas" :class="isEditMode ? 'fa-save' : 'fa-plus'"></i>
                <span v-if="saveLoading">Đang xử lý...</span>
                <span v-else>{{ isEditMode ? 'Cập nhật' : 'Thêm mới' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Layout from '@/components/common/Layout.vue';
import nhanVienService from '@/services/nhanVien.service';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const saveLoading = ref(false);
const error = ref('');
const showPassword = ref(false);

const formData = reactive({
  hoTenNV: '',
  email: '',
  chucVu: 'Nhân viên',
  diaChi: '',
  soDienThoai: '',
  matKhau: ''
});

const isEditMode = computed(() => {
  return !!route.params.id;
});

const fetchStaffDetail = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const staffId = route.params.id;
    const response = await nhanVienService.getNhanVien(staffId);
    
    if (response.nhanVien) {
      const staff = response.nhanVien;
      formData.hoTenNV = staff.hoTenNV || '';
      formData.email = staff.email || '';
      formData.chucVu = staff.chucVu || 'Nhân viên';
      formData.diaChi = staff.diaChi || '';
      formData.soDienThoai = staff.soDienThoai || '';
      formData.matKhau = ''; // Không hiển thị mật khẩu cũ
    } else {
      error.value = 'Không tìm thấy thông tin nhân viên.';
    }
  } catch (err) {
    console.error('Lỗi khi tải thông tin nhân viên:', err);
    error.value = 'Không thể tải thông tin nhân viên. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
};

const saveStaff = async () => {
  try {
    saveLoading.value = true;
    error.value = '';
    
    const staffData = { ...formData };
    
    // Xóa trường mật khẩu nếu không có thay đổi trong chế độ chỉnh sửa
    if (isEditMode.value && !staffData.matKhau) {
      delete staffData.matKhau;
    }
    
    if (isEditMode.value) {
      await nhanVienService.updateNhanVien(route.params.id, staffData);
      alert('Cập nhật nhân viên thành công!');
    } else {
      await nhanVienService.createNhanVien(staffData);
      alert('Thêm nhân viên mới thành công!');
    }
    
    // Chuyển hướng về trang danh sách nhân viên
    router.push('/quan-ly/nhan-vien');
  } catch (err) {
    console.error('Lỗi khi lưu nhân viên:', err);
    error.value = err.response?.data?.message || 'Không thể lưu thông tin nhân viên. Vui lòng thử lại sau.';
  } finally {
    saveLoading.value = false;
  }
};

onMounted(() => {
  if (isEditMode.value) {
    fetchStaffDetail();
  }
});
</script>

<style scoped>
.staff-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 0;
}

.required {
  color: var(--error-color);
}

.form-text {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
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
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.form-actions .btn {
  min-width: 120px;
}
</style>