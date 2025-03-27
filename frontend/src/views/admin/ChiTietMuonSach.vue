<template>
  <Layout page-title="Chi tiết phiếu mượn">
    <div class="borrow-detail-container">
      <div class="alert alert-info" v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải thông tin phiếu mượn...
      </div>
      
      <div class="alert alert-error" v-if="error">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>
      
      <div v-if="!loading && !error" class="borrow-detail-content">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Thông tin phiếu mượn</h2>
            <div class="borrow-status">
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
              <button 
                v-if="borrow.tinhTrang === 'Chưa duyệt'" 
                class="btn btn-primary"
                @click="approveBorrow"
              >
                <i class="fas fa-check"></i> Duyệt phiếu mượn
              </button>
              <button 
                v-if="borrow.tinhTrang === 'Đã duyệt'" 
                class="btn btn-success"
                @click="returnBook"
              >
                <i class="fas fa-undo"></i> Xác nhận trả sách
              </button>
            </div>
          </div>
          
          <div class="card-body">
            <div class="borrow-info">
              <div class="row">
                <div class="col-md-6">
                  <div class="info-section">
                    <h3><i class="fas fa-user"></i> Thông tin độc giả</h3>
                    <div class="info-content">
                      <div class="info-row">
                        <div class="info-group">
                          <label>Mã độc giả</label>
                          <p>{{ borrow.maDocGia?.maDocGia }}</p>
                        </div>
                        <div class="info-group">
                          <label>Họ tên</label>
                          <p>{{ borrow.maDocGia?.hoLot }} {{ borrow.maDocGia?.ten }}</p>
                        </div>
                      </div>
                      <div class="info-row">
                        <div class="info-group">
                          <label>Email</label>
                          <p>{{ borrow.maDocGia?.email }}</p>
                        </div>
                        <div class="info-group">
                          <label>Số điện thoại</label>
                          <p>{{ borrow.maDocGia?.dienThoai || 'Không có' }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                                             <div class="info-section">
                    <h3><i class="fas fa-book"></i> Thông tin sách</h3>
                    <div class="info-content">
                      <div class="reader-info-container">
                        <div class="book-cover" v-if="borrow.maSach?.hinhAnh">
                          <img :src="borrow.maSach?.hinhAnh" alt="Book Cover" />
                        </div> 
                        <div class="reader-details">
                          <div class="info-row">
                            <div class="info-group">
                              <label>Mã sách</label>
                              <p>{{ borrow.maSach?.maSach }}</p> 
                            </div>
                          </div>
                          <div class="info-row">
                            <div class="info-group">
                              <label>Tên sách</label>
                              <p>{{ borrow.maSach?.tenSach }}</p> 
                            </div>
                          </div>
                          <div class="info-row">
                            <div class="info-group">
                              <label>Tác giả</label>
                              <p>{{ borrow.maSach?.tacGia }}</p> 
                            </div>
                          </div>
                          <div class="info-row">
                            <div class="info-group">
                              <label>Nhà xuất bản</label>
                              <p>{{ borrow.maSach?.maNXB?.tenNXB }}</p> 
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="row mt-4">
                <div class="col-12">
                  <div class="info-section">
                    <h3><i class="fas fa-calendar-alt"></i> Thông tin mượn trả</h3>
                    <div class="info-content">
                      <div class="timeline">
                        <div class="timeline-item">
                          <div class="timeline-marker" :class="{'active': true}">
                            <i class="fas fa-calendar-plus"></i>
                          </div>
                          <div class="timeline-content">
                            <h4>Ngày mượn</h4>
                            <p>{{ formatDate(borrow.ngayMuon) }}</p>
                          </div>
                        </div>
                        
                        <div class="timeline-item">
                          <div class="timeline-marker" :class="{'active': borrow.tinhTrang !== 'Chưa duyệt'}">
                            <i class="fas fa-check"></i>
                          </div>
                          <div class="timeline-content">
                            <h4>Duyệt phiếu mượn</h4>
                            <p v-if="borrow.tinhTrang !== 'Chưa duyệt'">
                              Đã duyệt bởi: {{ staffInfo }}
                            </p>
                            <p v-else>Chưa duyệt</p>
                          </div>
                        </div>
                        
                        <div class="timeline-item">
                          <div class="timeline-marker" :class="{'active': borrow.tinhTrang === 'Đã trả'}">
                            <i class="fas fa-calendar-check"></i>
                          </div>
                          <div class="timeline-content">
                            <h4>Ngày trả (dự kiến)</h4>
                            <p>{{ formatDate(borrow.ngayTra) }}</p>
                          </div>
                        </div>
                        
                        <div class="timeline-item" v-if="borrow.tinhTrang === 'Đã trả'">
                          <div class="timeline-marker active">
                            <i class="fas fa-undo-alt"></i>
                          </div>
                          <div class="timeline-content">
                            <h4>Ngày trả (thực tế)</h4>
                            <p>{{ formatDate(borrow.ngayTraThucTe) }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <router-link to="/quan-ly/muon-sach" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Quay lại
          </router-link>
        </div>
      </div>
      
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
            
            <div class="borrow-info-modal">
              <p><strong>Độc giả:</strong> {{ borrow.maDocGia?.hoLot }} {{ borrow.maDocGia?.ten }}</p>
              <p><strong>Sách:</strong> {{ borrow.maSach?.tenSach }}</p>
              <p><strong>Ngày mượn:</strong> {{ formatDate(borrow.ngayMuon) }}</p>
              <p><strong>Ngày trả (dự kiến):</strong> {{ formatDate(borrow.ngayTra) }}</p>
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
      
      <!-- Modal xác nhận trả sách -->
      <div class="modal" v-if="showReturnModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Xác nhận trả sách</h2>
            <button class="modal-close" @click="showReturnModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="alert alert-error" v-if="returnError">{{ returnError }}</div>
            
            <p>Bạn có chắc chắn muốn xác nhận độc giả đã trả sách này?</p>
            
            <div class="borrow-info-modal">
              <p><strong>Độc giả:</strong> {{ borrow.maDocGia?.hoLot }} {{ borrow.maDocGia?.ten }}</p>
              <p><strong>Sách:</strong> {{ borrow.maSach?.tenSach }}</p>
              <p><strong>Ngày mượn:</strong> {{ formatDate(borrow.ngayMuon) }}</p>
              <p><strong>Ngày trả (dự kiến):</strong> {{ formatDate(borrow.ngayTra) }}</p>
            </div>
            
            <div class="form-group">
              <label for="ngayTraThucTe">Ngày trả (thực tế):</label>
              <input 
                type="date" 
                id="ngayTraThucTe" 
                class="form-control" 
                v-model="returnForm.ngayTraThucTe" 
                :min="borrow.ngayMuon?.split('T')[0]" 
                required 
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showReturnModal = false">Hủy</button>
            <button class="btn btn-success" @click="confirmReturn" :disabled="returnLoading">
              <span v-if="returnLoading">Đang xử lý...</span>
              <span v-else>Xác nhận trả sách</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Layout from '@/components/common/Layout.vue';
import muonSachService from '@/services/muonSach.service';
import nhanVienService from '@/services/nhanVien.service';

const route = useRoute();
const router = useRouter();
const borrow = ref({});
const staff = ref(null);
const loading = ref(true);
const error = ref('');

const showApproveModal = ref(false);
const approveLoading = ref(false);
const approveError = ref('');

const showReturnModal = ref(false);
const returnLoading = ref(false);
const returnError = ref('');
const returnForm = reactive({
  ngayTraThucTe: new Date().toISOString().split('T')[0]
});

const readerInitial = computed(() => {
  if (borrow.value.maDocGia?.ten) {
    return borrow.value.maDocGia.ten.charAt(0);
  }
  return 'U';
});

const staffInfo = computed(() => {
  if (staff.value) {
    return `${staff.value.maNV}: ${staff.value.hoTenNV}`;
  } else if (borrow.value.maNV) {
    if (typeof borrow.value.maNV === 'object' && borrow.value.maNV.hoTenNV) {
      return `${borrow.value.maNV.maNV || ''}: ${borrow.value.maNV.hoTenNV}`;
    } else {
      return `${borrow.value.maNV}`;
    }
  }
  return 'Không xác định';
});

const fetchBorrowDetail = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const borrowId = route.params.id;
    const response = await muonSachService.getMuonSach(borrowId);
    
    if (response.theoDoiMuonSach) {
      borrow.value = response.theoDoiMuonSach;
      
      // Nếu có mã nhân viên, lấy thông tin chi tiết nhân viên
      if (borrow.value.maNV && typeof borrow.value.maNV !== 'object') {
        await fetchStaffDetail(borrow.value.maNV);
      }
    } else {
      error.value = 'Không tìm thấy thông tin phiếu mượn.';
    }
  } catch (err) {
    console.error('Lỗi khi tải thông tin phiếu mượn:', err);
    error.value = 'Không thể tải thông tin phiếu mượn. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
};

const fetchStaffDetail = async (staffId) => {
  try {
    const response = await nhanVienService.getNhanVien(staffId);
    if (response.nhanVien) {
      staff.value = response.nhanVien;
    }
  } catch (err) {
    console.error('Lỗi khi tải thông tin nhân viên:', err);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const approveBorrow = () => {
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
    
    await muonSachService.approveMuonSach(borrow.value._id, { maNV: userId });
    
    // Đóng modal và cập nhật lại thông tin phiếu mượn
    showApproveModal.value = false;
    await fetchBorrowDetail();
    
    // Hiển thị thông báo thành công
    alert('Duyệt phiếu mượn thành công!');
  } catch (error) {
    console.error('Lỗi khi duyệt phiếu mượn:', error);
    approveError.value = error.response?.data?.message || 'Không thể duyệt phiếu mượn. Vui lòng thử lại sau.';
  } finally {
    approveLoading.value = false;
  }
};

const returnBook = () => {
  showReturnModal.value = true;
  returnError.value = '';
  returnForm.ngayTraThucTe = new Date().toISOString().split('T')[0];
};

const confirmReturn = async () => {
  try {
    returnLoading.value = true;
    returnError.value = '';
    
    if (!returnForm.ngayTraThucTe) {
      returnError.value = 'Vui lòng chọn ngày trả sách.';
      return;
    }
    
    await muonSachService.returnBook(borrow.value._id, { 
      ngayTraThucTe: returnForm.ngayTraThucTe 
    });
    
    // Đóng modal và cập nhật lại thông tin phiếu mượn
    showReturnModal.value = false;
    await fetchBorrowDetail();
    
    // Hiển thị thông báo thành công
    alert('Xác nhận trả sách thành công!');
  } catch (error) {
    console.error('Lỗi khi xác nhận trả sách:', error);
    returnError.value = error.response?.data?.message || 'Không thể xác nhận trả sách. Vui lòng thử lại sau.';
  } finally {
    returnLoading.value = false;
  }
};

onMounted(() => {
  fetchBorrowDetail();
});
</script>

<style scoped>
.borrow-detail-container {
  padding: 1rem 0;
  width: 100%;
}

.borrow-detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--primary-color);
}

.card-body {
  padding: 1.5rem;
}

.borrow-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-approved {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-canceled {
  background-color: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.status-pending {
  background-color: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.status-returned {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-md-6 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

.col-12 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

.mt-4 {
  margin-top: 1.5rem;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-content {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

.reader-info-container, .book-info-container {
  display: flex;
  gap: 1rem;
}

.reader-avatar {
  flex-shrink: 0;
}

.avatar-circle {
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

.reader-details, .book-details {
  flex: 1;
}

.book-cover {
  width: 120px;
  height: 160px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #eee;
  background-color: white;
  flex-shrink: 0;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-cover.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #999;
}

.info-row {
  display: flex;
  margin-bottom: 1rem;
  gap: 1rem;
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
  color: var(--text-color);
  background-color: white;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #eee;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  width: 2px;
  background-color: #eee;
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.timeline-marker.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.timeline-content {
  padding-left: 0.5rem;
}

.timeline-content h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.timeline-content p {
  margin: 0;
  color: #666;
}

.action-buttons {
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;
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

.borrow-info-modal {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

@media (min-width: 768px) {
  .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .borrow-status {
    width: 100%;
    justify-content: space-between;
  }
  
  .reader-info-container, .book-info-container {
    flex-direction: column;
    align-items: center;
  }
  
  .reader-avatar, .book-cover {
    margin-bottom: 1rem;
  }
  
  .book-cover {
    width: 100%;
    max-width: 200px;
    height: 250px;
  }
  
  .info-row {
    flex-direction: column;
  }
}
</style>