<template>
  <Layout page-title="Quản lý độc giả" :show-search="true" @search="handleSearch">
    <div class="reader-management-container">
      <div class="action-bar">
        <div class="filters">
          <div class="filter-group">
            <label for="trangThai">Trạng thái:</label>
            <select id="trangThai" class="form-control" v-model="filters.trangThai">
              <option value="">Tất cả</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Bị khóa">Bị khóa</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="sortBy">Sắp xếp theo:</label>
            <select id="sortBy" class="form-control" v-model="filters.sortBy">
              <option value="ten">Tên</option>
              <option value="maDocGia">Mã độc giả</option>
              <option value="ngayDangKy">Ngày đăng ký</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="alert alert-info" v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách độc giả...
      </div>
      
      <div class="alert alert-warning" v-if="!loading && readers.length === 0">
        <i class="fas fa-exclamation-triangle"></i> Không tìm thấy độc giả nào.
      </div>
      
      <div class="card" v-if="!loading && readers.length > 0">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Mã độc giả</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Ngày đăng ký</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reader in readers" :key="reader._id">
                  <td>{{ reader.maDocGia }}</td>
                  <td>{{ reader.hoLot }} {{ reader.ten }}</td>
                  <td>{{ reader.email }}</td>
                  <td>{{ reader.dienThoai }}</td>
                  <td>{{ formatDate(reader.ngayDangKy) }}</td>
                  <td>
                    <span 
                      class="status-badge" 
                      :class="{
                        'status-approved': reader.trangThai === 'Hoạt động',
                        'status-canceled': reader.trangThai === 'Bị khóa'
                      }"
                    >
                      {{ reader.trangThai }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <router-link :to="`/quan-ly/doc-gia/${reader._id}`" class="btn btn-secondary btn-sm">
                        <i class="fas fa-eye"></i>
                      </router-link>
                      <button 
                        class="btn btn-sm" 
                        :class="reader.trangThai === 'Hoạt động' ? 'btn-danger' : 'btn-primary'"
                        @click="toggleReaderStatus(reader)"
                      >
                        <i class="fas" :class="reader.trangThai === 'Hoạt động' ? 'fa-lock' : 'fa-unlock'"></i>
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
      
      <!-- Modal xác nhận thay đổi trạng thái -->
      <div class="modal" v-if="showStatusModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Xác nhận thay đổi trạng thái</h2>
            <button class="modal-close" @click="showStatusModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="alert alert-error" v-if="statusError">{{ statusError }}</div>
            
            <p>Bạn có chắc chắn muốn {{ selectedReader?.trangThai === 'Hoạt động' ? 'khóa' : 'mở khóa' }} tài khoản này?</p>
            
            <div class="reader-info">
              <p><strong>Mã độc giả:</strong> {{ selectedReader?.maDocGia }}</p>
              <p><strong>Họ tên:</strong> {{ selectedReader?.hoLot }} {{ selectedReader?.ten }}</p>
              <p><strong>Email:</strong> {{ selectedReader?.email }}</p>
              <p><strong>Trạng thái hiện tại:</strong> {{ selectedReader?.trangThai }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showStatusModal = false">Hủy</button>
            <button 
              class="btn" 
              :class="selectedReader?.trangThai === 'Hoạt động' ? 'btn-danger' : 'btn-primary'"
              @click="confirmToggleStatus" 
              :disabled="statusLoading"
            >
              <span v-if="statusLoading">Đang xử lý...</span>
              <span v-else>{{ selectedReader?.trangThai === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import Layout from '@/components/common/Layout.vue';
import Pagination from '@/components/common/Pagination.vue';
import docGiaService from '@/services/docGia.service';

const readers = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(10);
const searchQuery = ref('');

const filters = reactive({
  trangThai: '',
  sortBy: 'ten'
});

const showStatusModal = ref(false);
const selectedReader = ref(null);
const statusLoading = ref(false);
const statusError = ref('');

const fetchReaders = async () => {
  try {
    loading.value = true;
    
    let params = {
      page: currentPage.value,
      limit: limit.value
    };
    
    if (filters.trangThai) {
      params.trangThai = filters.trangThai;
    }
    
    const response = await docGiaService.getDocGias(params);
    
    readers.value = response.docGia || [];
    
    // Sắp xếp độc giả theo bộ lọc
    if (filters.sortBy) {
      readers.value.sort((a, b) => {
        if (filters.sortBy === 'ngayDangKy') {
          return new Date(b.ngayDangKy) - new Date(a.ngayDangKy);
        } else if (filters.sortBy === 'ten') {
          return (a.hoLot + ' ' + a.ten).localeCompare(b.hoLot + ' ' + b.ten);
        } else {
          return a[filters.sortBy]?.localeCompare(b[filters.sortBy]);
        }
      });
    }
    
    const total = response.total || 0;
    totalPages.value = Math.ceil(total / limit.value);
  } catch (error) {
    console.error('Lỗi khi tải danh sách độc giả:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
  fetchReaders();
};

const changePage = (page) => {
  currentPage.value = page;
  fetchReaders();
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const toggleReaderStatus = (reader) => {
  selectedReader.value = reader;
  showStatusModal.value = true;
  statusError.value = '';
};

const confirmToggleStatus = async () => {
  try {
    statusLoading.value = true;
    statusError.value = '';
    
    await docGiaService.toggleDocGiaStatus(selectedReader.value._id);
    
    // Đóng modal và cập nhật lại danh sách
    showStatusModal.value = false;
    fetchReaders();
    
    // Hiển thị thông báo thành công
    alert(`Đã ${selectedReader.value.trangThai === 'Hoạt động' ? 'khóa' : 'mở khóa'} tài khoản độc giả thành công!`);
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái độc giả:', error);
    statusError.value = error.response?.data?.message || 'Không thể thay đổi trạng thái độc giả. Vui lòng thử lại sau.';
  } finally {
    statusLoading.value = false;
  }
};

watch(() => filters.trangThai, () => {
  currentPage.value = 1;
  fetchReaders();
});

watch(() => filters.sortBy, () => {
  fetchReaders();
});

onMounted(() => {
  fetchReaders();
});
</script>

<style scoped>
.reader-management-container {
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

.reader-info {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>