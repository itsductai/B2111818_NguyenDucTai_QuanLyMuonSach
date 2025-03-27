<template>
  <Layout page-title="Quản lý mượn sách" :show-search="true" @search="handleSearch">
    <div class="borrow-management-container">
      <div class="action-bar">
        <div class="filters">
          <div class="filter-group">
            <label for="tinhTrang">Trạng thái:</label>
            <select id="tinhTrang" class="form-control" v-model="filters.tinhTrang">
              <option value="">Tất cả</option>
              <option value="Chưa duyệt">Chưa duyệt</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Đã trả">Đã trả</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="sortBy">Sắp xếp theo:</label>
            <select id="sortBy" class="form-control" v-model="filters.sortBy">
              <option value="ngayMuon">Ngày mượn</option>
              <option value="ngayTra">Ngày trả</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="alert alert-info" v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách phiếu mượn...
      </div>
      
      <div class="alert alert-warning" v-if="!loading && borrows.length === 0">
        <i class="fas fa-exclamation-triangle"></i> Không tìm thấy phiếu mượn nào.
      </div>
      
      <div class="card" v-if="!loading && borrows.length > 0">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Độc giả</th>
                  <th>Sách</th>
                  <th>Ngày mượn</th>
                  <th>Ngày trả (dự kiến)</th>
                  <th>Ngày trả (thực tế)</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="borrow in borrows" :key="borrow._id">
                  <td>{{ borrow.maDocGia?.hoLot }} {{ borrow.maDocGia?.ten }}</td>
                  <td>{{ borrow.maSach?.tenSach }}</td>
                  <td>{{ formatDate(borrow.ngayMuon) }}</td>
                  <td>{{ formatDate(borrow.ngayTra) }}</td>
                  <td>{{ borrow.ngayTraThucTe ? formatDate(borrow.ngayTraThucTe) : '-' }}</td>
                  <td>
                    <span 
                      class="status-badge" 
                      :class="{
                        'status-pending': borrow.tinhTrang === 'Chưa duyệt',
                        'status-approved': borrow.tinhTrang === 'Đã duyệt',
                        'status-returned': borrow.tinhTrang === 'Đã trả',
                        'status-canceled': borrow.tinhTrang === 'Đã hủy'
                      }"
                    >
                      {{ borrow.tinhTrang }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <router-link :to="`/quan-ly/muon-sach/${borrow._id}`" class="btn btn-secondary btn-sm">
                        <i class="fas fa-eye"></i>
                      </router-link>
                      <button 
                        v-if="borrow.tinhTrang === 'Chưa duyệt'" 
                        class="btn btn-primary btn-sm"
                        @click="approveBorrow(borrow)"
                      >
                        <i class="fas fa-check"></i>
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
      
      <!-- Modal xác nhận duyệt -->
      <div class="modal" v-if="showApproveModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Xác nhận duyệt phiếu mượn</h2>
            <button class="modal-close" @click="showApproveModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="alert alert-error" v-if="approveError">{{ approveError }}</div>
            
            <p>Bạn có chắc chắn muốn duyệt phiếu mượn này?</p>
            
            <div class="borrow-info">
              <p><strong>Độc giả:</strong> {{ selectedBorrow?.maDocGia?.hoLot }} {{ selectedBorrow?.maDocGia?.ten }}</p>
              <p><strong>Sách:</strong> {{ selectedBorrow?.maSach?.tenSach }}</p>
              <p><strong>Ngày mượn:</strong> {{ formatDate(selectedBorrow?.ngayMuon) }}</p>
              <p><strong>Ngày trả (dự kiến):</strong> {{ formatDate(selectedBorrow?.ngayTra) }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showApproveModal = false">Hủy</button>
            <button class="btn btn-primary" @click="confirmApprove" :disabled="approveLoading">
              <span v-if="approveLoading">Đang xử lý...</span>
              <span v-else>Xác nhận duyệt</span>
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
import muonSachService from '@/services/muonSach.service';
import authService from '@/services/auth.services';

const borrows = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(10);
const searchQuery = ref('');

const filters = reactive({
  tinhTrang: '',
  sortBy: 'ngayMuon'
});

const showApproveModal = ref(false);
const selectedBorrow = ref(null);
const approveLoading = ref(false);
const approveError = ref('');

const fetchBorrows = async () => {
  try {
    loading.value = true;
    
    let params = {
      page: currentPage.value,
      limit: limit.value
    };
    
    if (filters.tinhTrang) {
      params.tinhTrang = filters.tinhTrang;
    }
    
    const response = await muonSachService.getMuonSachs(params);
    
    borrows.value = response.theoDoiMuonSach || [];
    
    // Sắp xếp phiếu mượn theo bộ lọc
    if (filters.sortBy) {
      borrows.value.sort((a, b) => {
        const dateA = new Date(a[filters.sortBy]);
        const dateB = new Date(b[filters.sortBy]);
        return dateB - dateA; // Sắp xếp giảm dần (mới nhất lên đầu)
      });
    }
    
    const total = response.total || 0;
    totalPages.value = Math.ceil(total / limit.value);
  } catch (error) {
    console.error('Lỗi khi tải danh sách phiếu mượn:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
  fetchBorrows();
};

const changePage = (page) => {
  currentPage.value = page;
  fetchBorrows();
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const approveBorrow = (borrow) => {
  selectedBorrow.value = borrow;
  showApproveModal.value = true;
  approveError.value = '';
};

const confirmApprove = async () => {
  try {
    approveLoading.value = true;
    approveError.value = '';
    
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      approveError.value = 'Không thể xác định nhân viên duyệt. Vui lòng đăng nhập lại.';
      return;
    }
    
    await muonSachService.approveMuonSach(selectedBorrow.value._id, { maNV: userId });
    
    // Đóng modal và cập nhật lại danh sách
    showApproveModal.value = false;
    fetchBorrows();
    
    // Hiển thị thông báo thành công
    alert('Duyệt phiếu mượn thành công!');
  } catch (error) {
    console.error('Lỗi khi duyệt phiếu mượn:', error);
    approveError.value = error.response?.data?.message || 'Không thể duyệt phiếu mượn. Vui lòng thử lại sau.';
  } finally {
    approveLoading.value = false;
  }
};

watch(() => filters.tinhTrang, () => {
  currentPage.value = 1;
  fetchBorrows();
});

watch(() => filters.sortBy, () => {
  fetchBorrows();
});

onMounted(() => {
  fetchBorrows();
});
</script>

<style scoped>
.borrow-management-container {
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

.borrow-info {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>