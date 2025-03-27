<template>
  <Layout page-title="Lịch sử mượn sách">
    <div class="borrow-history-container">
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
        
        <button class="btn btn-secondary" @click="resetFilters">
          <i class="fas fa-sync-alt"></i> Đặt lại
        </button>
      </div>
      
      <div class="alert alert-info" v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải lịch sử mượn sách...
      </div>
      
      <div class="alert alert-warning" v-if="!loading && borrows.length === 0">
        <i class="fas fa-exclamation-triangle"></i> Bạn chưa có lịch sử mượn sách nào.
      </div>
      
      <div class="card" v-if="!loading && borrows.length > 0">
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th>Tên sách</th>
                <th>Ngày mượn</th>
                <th>Ngày trả (dự kiến)</th>
                <th>Ngày trả (thực tế)</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="borrow in borrows" :key="borrow._id">
                <td>{{ borrow.sach?.tenSach }}</td>
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
                  <button 
                    v-if="borrow.tinhTrang === 'Đã duyệt'" 
                    class="btn btn-primary btn-sm"
                    @click="returnBook(borrow)"
                  >
                    Trả sách
                  </button>
                  <button 
                    v-else-if="borrow.tinhTrang === 'Chưa duyệt'" 
                    class="btn btn-danger btn-sm"
                    @click="cancelBorrow(borrow)"
                  >
                    Hủy
                  </button>
                  <span v-else>-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Modal trả sách -->
      <div class="modal" v-if="showReturnModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Trả sách</h2>
            <button class="modal-close" @click="showReturnModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="alert alert-error" v-if="returnError">{{ returnError }}</div>
            
            <div class="return-book-info">
              <h3>{{ selectedBorrow?.sach?.tenSach }}</h3>
              <p><strong>Ngày mượn:</strong> {{ formatDate(selectedBorrow?.ngayMuon) }}</p>
              <p><strong>Ngày trả (dự kiến):</strong> {{ formatDate(selectedBorrow?.ngayTra) }}</p>
            </div>
            
            <div class="form-group">
              <label for="ngayTraThucTe">Ngày trả (thực tế):</label>
              <input 
                type="date" 
                id="ngayTraThucTe" 
                class="form-control" 
                v-model="returnForm.ngayTraThucTe" 
                :min="selectedBorrow?.ngayMuon"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showReturnModal = false">Hủy</button>
            <button class="btn btn-primary" @click="confirmReturn" :disabled="returnLoading">
              <span v-if="returnLoading">Đang xử lý...</span>
              <span v-else>Xác nhận trả</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal hủy mượn sách -->
      <div class="modal" v-if="showCancelModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Hủy mượn sách</h2>
            <button class="modal-close" @click="showCancelModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="alert alert-error" v-if="cancelError">{{ cancelError }}</div>
            
            <p>Bạn có chắc chắn muốn hủy yêu cầu mượn sách này?</p>
            
            <div class="cancel-book-info">
              <h3>{{ selectedBorrow?.sach?.tenSach }}</h3>
              <p><strong>Ngày mượn:</strong> {{ formatDate(selectedBorrow?.ngayMuon) }}</p>
              <p><strong>Ngày trả (dự kiến):</strong> {{ formatDate(selectedBorrow?.ngayTra) }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showCancelModal = false">Đóng</button>
            <button class="btn btn-danger" @click="confirmCancel" :disabled="cancelLoading">
              <span v-if="cancelLoading">Đang xử lý...</span>
              <span v-else>Xác nhận hủy</span>
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
import muonSachService from '@/services/muonSach.service';

const borrows = ref([]);
const loading = ref(false);
const filters = reactive({
  tinhTrang: '',
  sortBy: 'ngayMuon'
});

const showReturnModal = ref(false);
const showCancelModal = ref(false);
const selectedBorrow = ref(null);
const returnLoading = ref(false);
const cancelLoading = ref(false);
const returnError = ref('');
const cancelError = ref('');
const returnForm = reactive({
  ngayTraThucTe: new Date().toISOString().split('T')[0]
});

const fetchBorrows = async () => {
  try {
    loading.value = true;
    
    const userId = localStorage.getItem('userId');
    const response = await muonSachService.getDocGiaMuonSachs(userId);
    
    let filteredBorrows = response.theoDoiMuonSach || [];
    
    // Lọc theo trạng thái
    if (filters.tinhTrang) {
      filteredBorrows = filteredBorrows.filter(borrow => borrow.tinhTrang === filters.tinhTrang);
    }
    
    // Sắp xếp
    filteredBorrows.sort((a, b) => {
      const dateA = new Date(a[filters.sortBy]);
      const dateB = new Date(b[filters.sortBy]);
      return dateB - dateA; // Sắp xếp giảm dần (mới nhất lên đầu)
    });
    
    borrows.value = filteredBorrows;
  } catch (error) {
    console.error('Lỗi khi tải lịch sử mượn sách:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const resetFilters = () => {
  filters.tinhTrang = '';
  filters.sortBy = 'ngayMuon';
  fetchBorrows();
};

const returnBook = (borrow) => {
  selectedBorrow.value = borrow;
  showReturnModal.value = true;
  returnError.value = '';
  returnForm.ngayTraThucTe = new Date().toISOString().split('T')[0];
};

const confirmReturn = async () => {
  try {
    returnLoading.value = true;
    returnError.value = '';
    
    await muonSachService.returnMuonSach(selectedBorrow.value._id, {
      ngayTraThucTe: returnForm.ngayTraThucTe
    });
    
    // Đóng modal và cập nhật lại danh sách
    showReturnModal.value = false;
    fetchBorrows();
    
    // Hiển thị thông báo thành công
    alert('Trả sách thành công!');
  } catch (error) {
    console.error('Lỗi khi trả sách:', error);
    returnError.value = 'Không thể trả sách. Vui lòng thử lại sau.';
  } finally {
    returnLoading.value = false;
  }
};

const cancelBorrow = (borrow) => {
  selectedBorrow.value = borrow;
  showCancelModal.value = true;
  cancelError.value = '';
};

const confirmCancel = async () => {
  try {
    cancelLoading.value = true;
    cancelError.value = '';
    
    await muonSachService.deleteMuonSach(selectedBorrow.value._id, {
      tinhTrang: 'Đã hủy'
    });
    
    // Đóng modal và cập nhật lại danh sách
    showCancelModal.value = false;
    fetchBorrows();
    
    // Hiển thị thông báo thành công
    alert('Hủy yêu cầu mượn sách thành công!');
  } catch (error) {
    console.error('Lỗi khi hủy mượn sách:', error);
    cancelError.value = error.response?.data?.message || 'Không thể hủy yêu cầu mượn sách. Vui lòng thử lại sau.';
  } finally {
    cancelLoading.value = false;
  }
};

watch(() => filters.tinhTrang, () => {
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
.borrow-history-container {
  padding: 1rem 0;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
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

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending {
  background-color: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.status-approved {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.status-returned {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.status-canceled {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.75rem;
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

.return-book-info,
.cancel-book-info {
  margin-bottom: 1.5rem;
}

.return-book-info h3,
.cancel-book-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
</style>