<template>
  <Layout page-title="Quản lý nhân viên" :show-search="true" @search="handleSearch">
    <div class="staff-management-container">
      <div class="action-bar">
        <div class="filters">
          <div class="filter-group">
            <label for="chucVu">Chức vụ:</label>
            <select id="chucVu" class="form-control" v-model="filters.chucVu">
              <option value="">Tất cả</option>
              <option value="Admin">Admin</option>
              <option value="Nhân viên">Nhân viên</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="sortBy">Sắp xếp theo:</label>
            <select id="sortBy" class="form-control" v-model="filters.sortBy">
              <option value="hoTenNV">Họ tên</option>
              <option value="maNV">Mã nhân viên</option>
              <option value="chucVu">Chức vụ</option>
            </select>
          </div>
          <router-link to="/quan-ly/nhan-vien/them" class="btn btn-primary">
          <i class="fas fa-plus"></i> Thêm nhân viên mới
          </router-link>
        </div>
        
        
      </div>
      
      <div class="alert alert-info" v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách nhân viên...
      </div>
      
      <div class="alert alert-warning" v-if="!loading && staffs.length === 0">
        <i class="fas fa-exclamation-triangle"></i> Không tìm thấy nhân viên nào.
      </div>
      
      <div class="card" v-if="!loading && staffs.length > 0">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Chức vụ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="staff in staffs" :key="staff._id">
                  <td>{{ staff.maNV }}</td>
                  <td>{{ staff.hoTenNV }}</td>
                  <td>{{ staff.email }}</td>
                  <td>{{ staff.soDienThoai }}</td>
                  <td>
                    <span 
                      class="role-badge" 
                      :class="{ 'role-admin': staff.chucVu === 'Admin', 'role-staff': staff.chucVu === 'Nhân viên' }"
                    >
                      {{ staff.chucVu }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <router-link :to="`/quan-ly/nhan-vien/${staff._id}/sua`" class="btn btn-secondary btn-sm">
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button 
                        class="btn btn-danger btn-sm" 
                        @click="confirmDelete(staff)"
                        :disabled="staff.chucVu === 'Admin' && staff._id === currentUserId"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Pagination 
        v-if="totalPages > 1" 
        :current-page="currentPage" 
        :total-pages="totalPages" 
        @page-change="changePage" 
      />
      
      <!-- Modal xác nhận xóa -->
      <div class="modal" v-if="showDeleteModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Xác nhận xóa</h2>
            <button class="modal-close" @click="showDeleteModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="alert alert-error" v-if="deleteError">{{ deleteError }}</div>
            
            <p>Bạn có chắc chắn muốn xóa nhân viên này?</p>
            
            <div class="delete-staff-info">
              <p><strong>Mã nhân viên:</strong> {{ selectedStaff?.maNV }}</p>
              <p><strong>Họ tên:</strong> {{ selectedStaff?.hoTenNV }}</p>
              <p><strong>Email:</strong> {{ selectedStaff?.email }}</p>
              <p><strong>Chức vụ:</strong> {{ selectedStaff?.chucVu }}</p>
            </div>
            
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle"></i> Lưu ý: Hành động này không thể hoàn tác!
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteModal = false">Hủy</button>
            <button class="btn btn-danger" @click="deleteStaff" :disabled="deleteLoading">
              <span v-if="deleteLoading">Đang xử lý...</span>
              <span v-else>Xác nhận xóa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import Layout from '@/components/common/Layout.vue';
import Pagination from '@/components/common/Pagination.vue';
import nhanVienService from '@/services/nhanVien.service';
import authService from '@/services/auth.services';

const staffs = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(10);
const searchQuery = ref('');

const filters = reactive({
  chucVu: '',
  sortBy: 'hoTenNV'
});

const showDeleteModal = ref(false);
const selectedStaff = ref(null);
const deleteLoading = ref(false);
const deleteError = ref('');

const currentUserId = computed(() => {
  return localStorage.getItem('userId');
});

const fetchStaffs = async () => {
  try {
    loading.value = true;
    
    let params = {
      page: currentPage.value,
      limit: limit.value
    };
    
    if (filters.chucVu) {
      params.chucVu = filters.chucVu;
    }
    
    const response = await nhanVienService.getNhanViens(params);
    
    staffs.value = response.nhanVien || [];
    
    // Sắp xếp nhân viên theo bộ lọc
    if (filters.sortBy) {
      staffs.value.sort((a, b) => {
        return a[filters.sortBy]?.localeCompare(b[filters.sortBy]);
      });
    }
    
    const total = response.total || 0;
    totalPages.value = Math.ceil(total / limit.value);
  } catch (error) {
    console.error('Lỗi khi tải danh sách nhân viên:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
  fetchStaffs();
};

const changePage = (page) => {
  currentPage.value = page;
  fetchStaffs();
};

const confirmDelete = (staff) => {
  selectedStaff.value = staff;
  showDeleteModal.value = true;
  deleteError.value = '';
};

const deleteStaff = async () => {
  try {
    deleteLoading.value = true;
    deleteError.value = '';
    
    await nhanVienService.deleteNhanVien(selectedStaff.value._id);
    
    // Đóng modal và cập nhật lại danh sách
    showDeleteModal.value = false;
    fetchStaffs();
    
    // Hiển thị thông báo thành công
    alert('Xóa nhân viên thành công!');
  } catch (error) {
    console.error('Lỗi khi xóa nhân viên:', error);
    deleteError.value = error.response?.data?.message || 'Không thể xóa nhân viên. Vui lòng thử lại sau.';
  } finally {
    deleteLoading.value = false;
  }
};

watch(() => filters.chucVu, () => {
  currentPage.value = 1;
  fetchStaffs();
});

watch(() => filters.sortBy, () => {
  fetchStaffs();
});

onMounted(() => {
  fetchStaffs();
});
</script>

<style scoped>
.staff-management-container {
  padding: 1rem 0;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  flex: 1;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-admin {
  background-color: rgba(255, 135, 125, 0.1);
  color: var(--primary-color);
}

.role-staff {
  background-color: rgba(194, 207, 103, 0.1);
  color: var(--accent-color);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.75rem;
}

.table-responsive {
  overflow-x: auto;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.delete-staff-info {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>