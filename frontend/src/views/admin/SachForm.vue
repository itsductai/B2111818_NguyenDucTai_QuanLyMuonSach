<template>
  <Layout :page-title="isEditMode ? 'Chỉnh sửa sách' : 'Thêm sách mới'">
    <div class="book-form-container">
      <div class="card">
        <div class="card-body">
          <div class="alert alert-info" v-if="loading">
            <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
          </div>
          
          <div class="alert alert-error" v-if="error">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>
          
          <form @submit.prevent="saveBook" v-if="!loading">
            <div class="form-row">
              <div class="form-group">
                <label for="tenSach">Tên sách <span class="required">*</span></label>
                <input 
                  type="text" 
                  id="tenSach" 
                  class="form-control" 
                  v-model="formData.tenSach" 
                  required
                  placeholder="Nhập tên sách"
                />
              </div>
              
              <div class="form-group">
                <label for="tacGia">Tác giả <span class="required">*</span></label>
                <input 
                  type="text" 
                  id="tacGia" 
                  class="form-control" 
                  v-model="formData.tacGia" 
                  required
                  placeholder="Nhập tên tác giả"
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="maNXB">Nhà xuất bản <span class="required">*</span></label>
                <select id="maNXB" class="form-control" v-model="formData.maNXB" required>
                  <option value="">Chọn nhà xuất bản</option>
                  <option v-for="nxb in nhaXuatBans" :key="nxb._id" :value="nxb._id">
                    {{ nxb.tenNXB }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="namXuatBan">Năm xuất bản <span class="required">*</span></label>
                <input 
                  type="number" 
                  id="namXuatBan" 
                  class="form-control" 
                  v-model="formData.namXuatBan" 
                  required
                  min="1900"
                  :max="currentYear"
                  placeholder="Nhập năm xuất bản"
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="soQuyen">Số lượng <span class="required">*</span></label>
                <input 
                  type="number" 
                  id="soQuyen" 
                  class="form-control" 
                  v-model="formData.soQuyen" 
                  required
                  min="0"
                  placeholder="Nhập số lượng sách"
                />
              </div>
              
              <div class="form-group">
                <label for="donGia">Đơn giá (VNĐ) <span class="required">*</span></label>
                <input 
                  type="number" 
                  id="donGia" 
                  class="form-control" 
                  v-model="formData.donGia" 
                  required
                  min="0"
                  step="1000"
                  placeholder="Nhập đơn giá"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="hinhAnh">Hình ảnh (URL)</label>
              <input 
                type="url" 
                id="hinhAnh" 
                class="form-control" 
                v-model="formData.hinhAnh" 
                placeholder="Nhập URL hình ảnh"
              />
              <small class="form-text">Để trống nếu không có hình ảnh</small>
            </div>
            
            <div class="form-group">
              <label for="moTa">Mô tả</label>
              <textarea 
                id="moTa" 
                class="form-control" 
                v-model="formData.moTa" 
                rows="4"
                placeholder="Nhập mô tả sách"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <router-link to="/quan-ly/sach" class="btn btn-secondary">
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
import sachService from '@/services/sach.service';
import nhaXuatBanService from '@/services/nhaXuatBan.service';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const saveLoading = ref(false);
const error = ref('');
const nhaXuatBans = ref([]);

const formData = reactive({
  tenSach: '',
  tacGia: '',
  namXuatBan: new Date().getFullYear(),
  soQuyen: 0,
  donGia: 0,
  hinhAnh: '',
  maNXB: '',
  moTa: ''
});

const isEditMode = computed(() => {
  return !!route.params.id;
});

const currentYear = computed(() => {
  return new Date().getFullYear();
});

const fetchNhaXuatBans = async () => {
  try {
    const response = await nhaXuatBanService.getNhaXuatBans();
    nhaXuatBans.value = response.nhaXuatBan || [];
  } catch (err) {
    console.error('Lỗi khi tải danh sách nhà xuất bản:', err);
    error.value = 'Không thể tải danh sách nhà xuất bản. Vui lòng thử lại sau.';
  }
};

const fetchBookDetail = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const bookId = route.params.id;
    const response = await sachService.getSach(bookId);
    
    if (response.sach) {
      const book = response.sach;
      formData.tenSach = book.tenSach || '';
      formData.tacGia = book.tacGia || '';
      formData.namXuatBan = book.namXuatBan || new Date().getFullYear();
      formData.soQuyen = book.soQuyen || 0;
      formData.donGia = book.donGia || 0;
      formData.hinhAnh = book.hinhAnh || '';
      formData.maNXB = book.maNXB?._id || '';
      formData.moTa = book.moTa || '';
    } else {
      error.value = 'Không tìm thấy thông tin sách.';
    }
  } catch (err) {
    console.error('Lỗi khi tải thông tin sách:', err);
    error.value = 'Không thể tải thông tin sách. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
};

const saveBook = async () => {
  try {
    saveLoading.value = true;
    error.value = '';
    
    // Chuyển đổi các trường số
    const bookData = {
      ...formData,
      namXuatBan: parseInt(formData.namXuatBan),
      soQuyen: parseInt(formData.soQuyen),
      donGia: parseInt(formData.donGia)
    };
    
    if (isEditMode.value) {
      await sachService.updateSach(route.params.id, bookData);
      alert('Cập nhật sách thành công!');
    } else {
      await sachService.createSach(bookData);
      alert('Thêm sách mới thành công!');
    }
    
    // Chuyển hướng về trang danh sách sách
    router.push('/quan-ly/sach');
  } catch (err) {
    console.error('Lỗi khi lưu sách:', err);
    error.value = err.response?.data?.message || 'Không thể lưu thông tin sách. Vui lòng thử lại sau.';
  } finally {
    saveLoading.value = false;
  }
};

onMounted(async () => {
  await fetchNhaXuatBans();
  
  if (isEditMode.value) {
    await fetchBookDetail();
  }
});
</script>

<style scoped>
.book-form-container {
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

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.form-actions .btn {
  min-width: 120px;
}
</style>