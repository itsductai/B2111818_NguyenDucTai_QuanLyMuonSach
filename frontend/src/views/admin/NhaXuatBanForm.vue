<template>
  <Layout :page-title="isEditMode ? 'Chỉnh sửa nhà xuất bản' : 'Thêm nhà xuất bản mới'">
    <div class="publisher-form-container">
      <div class="card">
        <div class="card-body">
          <div class="alert alert-info" v-if="loading">
            <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
          </div>
          
          <div class="alert alert-error" v-if="error">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>
          
          <form @submit.prevent="savePublisher" v-if="!loading">
            <div class="form-group">
              <label for="maNXB">Mã nhà xuất bản <span class="required">*</span></label>
              <input 
                type="text" 
                id="maNXB" 
                class="form-control" 
                v-model="formData.maNXB" 
                required
                placeholder="Nhập mã nhà xuất bản"
                :disabled="isEditMode"
              />
              <small class="form-text" v-if="isEditMode">Mã nhà xuất bản không thể thay đổi sau khi tạo</small>
            </div>
            
            <div class="form-group">
              <label for="tenNXB">Tên nhà xuất bản <span class="required">*</span></label>
              <input 
                type="text" 
                id="tenNXB" 
                class="form-control" 
                v-model="formData.tenNXB" 
                required
                placeholder="Nhập tên nhà xuất bản"
              />
            </div>
            
            <div class="form-group">
              <label for="diaChi">Địa chỉ <span class="required">*</span></label>
              <input 
                type="text" 
                id="diaChi" 
                class="form-control" 
                v-model="formData.diaChi" 
                required
                placeholder="Nhập địa chỉ nhà xuất bản"
              />
            </div>
            
            <div class="form-actions">
              <router-link to="/quan-ly/nha-xuat-ban" class="btn btn-secondary">
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
import nhaXuatBanService from '@/services/nhaXuatBan.service';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const saveLoading = ref(false);
const error = ref('');

const formData = reactive({
  maNXB: '',
  tenNXB: '',
  diaChi: ''
});

const isEditMode = computed(() => {
  return !!route.params.id;
});

const fetchPublisherDetail = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const publisherId = route.params.id;
    const response = await nhaXuatBanService.getNhaXuatBan(publisherId);
    
    if (response.nhaXuatBan) {
      const publisher = response.nhaXuatBan;
      formData.maNXB = publisher.maNXB || '';
      formData.tenNXB = publisher.tenNXB || '';
      formData.diaChi = publisher.diaChi || '';
    } else {
      error.value = 'Không tìm thấy thông tin nhà xuất bản.';
    }
  } catch (err) {
    console.error('Lỗi khi tải thông tin nhà xuất bản:', err);
    error.value = 'Không thể tải thông tin nhà xuất bản. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
};

const savePublisher = async () => {
  try {
    saveLoading.value = true;
    error.value = '';
    
    if (isEditMode.value) {
      await nhaXuatBanService.updateNhaXuatBan(route.params.id, formData);
      alert('Cập nhật nhà xuất bản thành công!');
    } else {
      await nhaXuatBanService.createNhaXuatBan(formData);
      alert('Thêm nhà xuất bản mới thành công!');
    }
    
    // Chuyển hướng về trang danh sách nhà xuất bản
    router.push('/quan-ly/nha-xuat-ban');
  } catch (err) {
    console.error('Lỗi khi lưu nhà xuất bản:', err);
    error.value = err.response?.data?.message || 'Không thể lưu thông tin nhà xuất bản. Vui lòng thử lại sau.';
  } finally {
    saveLoading.value = false;
  }
};

onMounted(() => {
  if (isEditMode.value) {
    fetchPublisherDetail();
  }
});
</script>

<style scoped>
.publisher-form-container {
  max-width: 600px;
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