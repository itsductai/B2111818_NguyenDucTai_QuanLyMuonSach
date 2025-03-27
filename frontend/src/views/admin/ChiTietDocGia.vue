<template>
  <Layout :page-title="'Chi tiết độc giả: ' + (reader.hoLot || '') + ' ' + (reader.ten || '')">
    <div class="reader-detail-container">
      <div class="alert alert-info" v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải thông tin độc giả...
      </div>
      
      <div class="alert alert-error" v-if="error">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>
      
      <div v-if="!loading && !error" class="reader-detail-content">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Thông tin cá nhân</h2>
            <div class="reader-status">
              <span 
                class="status-badge" 
                :class="{
                  'status-approved': reader.trangThai === 'Hoạt động',
                  'status-canceled': reader.trangThai === 'Bị khóa'
                }"
              >
                {{ reader.trangThai }}
              </span>
              <button 
                class="btn btn-sm" 
                :class="reader.trangThai === 'Hoạt động' ? 'btn-danger' : 'btn-primary'"
                @click="toggleReaderStatus"
              >
                {{ reader.trangThai === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản' }}
              </button>
            </div>
          </div>
          
          <div class="card-body">
            <div class="reader-info">
              <div class="reader-avatar">
                <div class="avatar-large">{{ reader.ten ? reader.ten.charAt(0) : 'U' }}</div>
              </div>
              
              <div class="reader-details">
                <div class="info-row">
                  <div class="info-group">
                    <label>Mã độc giả</label>
                    <p>{{ reader.maDocGia }}</p>
                  </div>
                  <div class="info-group">
                    <label>Họ tên</label>
                    <p>{{ reader.hoLot }} {{ reader.ten }}</p>
                  </div>
                </div>
                
                <div class="info-row">
                  <div class="info-group">
                    <label>Ngày sinh</label>
                    <p>{{ formatDate(reader.ngaySinh) }}</p>
                  </div>
                  <div class="info-group">
                    <label>Giới tính</label>
                    <p>{{ reader.phai }}</p>
                  </div>
                </div>
                
                <div class="info-row">
                  <div class="info-group">
                    <label>Email</label>
                    <p>{{ reader.email }}</p>
                  </div>
                  <div class="info-group">
                    <label>Số điện thoại</label>
                    <p>{{ reader.dienThoai }}</p>
                  </div>
                </div>
                
                <div class="info-row">
                  <div class="info-group">
                    <label>Địa chỉ</label>
                    <p>{{ reader.diaChi }}</p>
                  </div>
                </div>
                
                <div class="info-row">
                  <div class="info-group">
                    <label>Ngày đăng ký</label>
                    <p>{{ formatDate(reader.ngayDangKy) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Lịch sử mượn sách</h2>
          </div>
          
          <div class="card-body">
            <div class="alert alert-info" v-if="borrowLoading">
              <i class="fas fa-spinner fa-spin"></i> Đang tải lịch sử mượn sách...
            </div>
            
            <div class="alert alert-warning" v-if="!borrowLoading && borrows.length === 0">
              <i class="fas fa-exclamation-triangle"></i> Độc giả chưa có lịch sử mượn sách nào.
            </div>
            
            <div v-if="!borrowLoading && borrows.length > 0">
              <div class="table-responsive">
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
                        <router-link :to="`/quan-ly/muon-sach/${borrow._id}`" class="btn btn-secondary btn-sm">
                          <i class="fas fa-eye"></i>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <router-link to="/quan-ly/doc-gia" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Quay lại
          </router-link>
        </div>
      </div>
      
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
            
            <p>Bạn có chắc chắn muốn {{ reader.trangThai === 'Hoạt động' ? 'khóa' : 'mở khóa' }} tài khoản này?</p>
            
            <div class="reader-info">
              <p><strong>Mã độc giả:</strong> {{ reader.maDocGia }}</p>
              <p><strong>Họ tên:</strong> {{ reader.hoLot }} {{ reader.ten }}</p>
              <p><strong>Email:</strong> {{ reader.email }}</p>
              <p><strong>Trạng thái hiện tại:</strong> {{ reader.trangThai }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showStatusModal = false">Hủy</button>
            <button 
              class="btn" 
              :class="reader.trangThai === 'Hoạt động' ? 'btn-danger' : 'btn-primary'"
              @click="confirmToggleStatus" 
              :disabled="statusLoading"
            >
              <span v-if="statusLoading">Đang xử lý...</span>
              <span v-else>{{ reader.trangThai === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Layout from '@/components/common/Layout.vue';
import docGiaService from '@/services/docGia.service';
import muonSachService from '@/services/muonSach.service';

const route = useRoute();
const router = useRouter();
const reader = ref({});
const borrows = ref([]);
const loading = ref(true);
const borrowLoading = ref(true);
const error = ref('');

const showStatusModal = ref(false);
const statusLoading = ref(false);
const statusError = ref('');

const fetchReaderDetail = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const readerId = route.params.id;
    const response = await docGiaService.getDocGia(readerId);
    
    if (response.docGia) {
      reader.value = response.docGia;
    } else {
      error.value = 'Không tìm thấy thông tin độc giả.';
    }
  } catch (err) {
    console.error('Lỗi khi tải thông tin độc giả:', err);
    error.value = 'Không thể tải thông tin độc giả. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
};

const fetchReaderBorrows = async () => {
  try {
    borrowLoading.value = true;
    
    const readerId = route.params.id;
    const response = await muonSachService.getDocGiaMuonSachs(readerId);
    
    borrows.value = response.theoDoiMuonSach || [];
  } catch (err) {
    console.error('Lỗi khi tải lịch sử mượn sách:', err);
  } finally {
    borrowLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const toggleReaderStatus = () => {
  showStatusModal.value = true;
  statusError.value = '';
};

const confirmToggleStatus = async () => {
  try {
    statusLoading.value = true;
    statusError.value = '';
    
    await docGiaService.toggleDocGiaStatus(reader.value._id);
    
    // Đóng modal và cập nhật lại thông tin độc giả
    showStatusModal.value = false;
    await fetchReaderDetail();
    
    // Hiển thị thông báo thành công
    alert(`Đã ${reader.value.trangThai === 'Hoạt động' ? 'mở khóa' : 'khóa'} tài khoản độc giả thành công!`);
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái độc giả:', error);
    statusError.value = error.response?.data?.message || 'Không thể thay đổi trạng thái độc giả. Vui lòng thử lại sau.';
  } finally {
    statusLoading.value = false;
  }
};

onMounted(() => {
  fetchReaderDetail();
  fetchReaderBorrows();
});
</script>

<style scoped>
.reader-detail-container {
  padding: 1rem 0;
}

.reader-detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--primary-color);
}

.reader-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reader-info {
  display: flex;
  gap: 2rem;
}

.reader-avatar {
  flex-shrink: 0;
}

.avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
}

.reader-details {
  flex: 1;
}

.info-row {
  display: flex;
  margin-bottom: 1rem;
  gap: 2rem;
}

.info-group {
  flex: 1;
}

.info-group label {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.info-group p {
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;
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

@media (max-width: 768px) {
  .reader-info {
    flex-direction: column;
    gap: 1rem;
  }
  
  .reader-avatar {
    display: flex;
    justify-content: center;
  }
  
  .info-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>