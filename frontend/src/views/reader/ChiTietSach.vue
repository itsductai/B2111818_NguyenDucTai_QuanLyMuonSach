<template>
  <Layout :page-title="book.tenSach || 'Chi tiết sách'">
    <div class="book-detail-container">
      <div class="alert alert-info" v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải thông tin sách...
      </div>
      
      <div class="alert alert-error" v-if="error">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>
      
      <div class="book-detail-content" v-if="!loading && !error">
        <div class="book-detail-left">
          <div class="book-cover">
            <img :src="book.hinhAnh || '/placeholder.jpg'" alt="Book Cover" />
          </div>
          
          <div class="book-actions">
            <button 
              class="btn btn-primary" 
              @click="borrowBook"
              :disabled="book.soQuyen <= 0"
            >
              <i class="fas fa-book-reader"></i>
              <span v-if="book.soQuyen > 0">Mượn sách</span>
              <span v-else>Hết sách</span>
            </button>
            <router-link to="/sach" class="btn btn-secondary">
              <i class="fas fa-arrow-left"></i> Quay lại
            </router-link>
          </div>
        </div>
        
        <div class="book-detail-right">
          <h1 class="book-title">{{ book.tenSach }}</h1>
          
          <div class="book-meta">
            <div class="book-meta-item">
              <span class="meta-label">Tác giả:</span>
              <span class="meta-value">{{ book.tacGia }}</span>
            </div>
            
            <div class="book-meta-item">
              <span class="meta-label">Nhà xuất bản:</span>
              <span class="meta-value">{{ book.maNXB?.tenNXB }}</span>
            </div>
            
            <div class="book-meta-item">
              <span class="meta-label">Năm xuất bản:</span>
              <span class="meta-value">{{ book.namXuatBan }}</span>
            </div>
            
            <div class="book-meta-item">
              <span class="meta-label">Đơn giá:</span>
              <span class="meta-value">{{ formatPrice(book.donGia) }}</span>
            </div>
            
            <div class="book-meta-item">
              <span class="meta-label">Số lượng còn lại:</span>
              <span class="meta-value" :class="{ 'text-error': book.soQuyen <= 0 }">
                {{ book.soQuyen }} quyển
              </span>
            </div>
          </div>
          
          <div class="book-description">
            <h3>Mô tả sách</h3>
            <p v-if="book.moTa">{{ book.moTa }}</p>
            <p v-else>Không có mô tả cho sách này.</p>
          </div>
        </div>
      </div>
      
      <!-- Modal mượn sách -->
      <div class="modal" v-if="showBorrowModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Mượn sách</h2>
            <button class="modal-close" @click="showBorrowModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="alert alert-error" v-if="borrowError">{{ borrowError }}</div>
            
            <div class="borrow-book-info">
              <h3>{{ book.tenSach }}</h3>
              <p><strong>Tác giả:</strong> {{ book.tacGia }}</p>
              <p><strong>Nhà xuất bản:</strong> {{ book.maNXB?.tenNXB }}</p>
            </div>
            
            <div class="form-group">
              <label for="ngayMuon">Ngày mượn:</label>
              <input 
                type="date" 
                id="ngayMuon" 
                class="form-control" 
                v-model="borrowForm.ngayMuon" 
                :min="today"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="ngayTra">Ngày trả (dự kiến):</label>
              <input 
                type="date" 
                id="ngayTra" 
                class="form-control" 
                v-model="borrowForm.ngayTra" 
                :min="borrowForm.ngayMuon"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showBorrowModal = false">Hủy</button>
            <button class="btn btn-primary" @click="confirmBorrow" :disabled="borrowLoading">
              <span v-if="borrowLoading">Đang xử lý...</span>
              <span v-else>Xác nhận mượn</span>
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
import sachService from '@/services/sach.service';
import muonSachService from '@/services/muonSach.service';

const route = useRoute();
const router = useRouter();
const book = ref({});
const loading = ref(true);
const error = ref('');

const showBorrowModal = ref(false);
const borrowLoading = ref(false);
const borrowError = ref('');
const borrowForm = reactive({
  ngayMuon: new Date().toISOString().split('T')[0],
  ngayTra: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
});

const today = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const fetchBookDetail = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const bookId = route.params.id;
    const response = await sachService.getSach(bookId);
    
    if (response.sach) {
      book.value = response.sach;
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const borrowBook = () => {
  showBorrowModal.value = true;
  borrowError.value = '';
  
  // Đặt ngày mượn là hôm nay
  borrowForm.ngayMuon = new Date().toISOString().split('T')[0];
  // Đặt ngày trả mặc định là 14 ngày sau
  borrowForm.ngayTra = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
};

const confirmBorrow = async () => {
  try {
    borrowLoading.value = true;
    borrowError.value = '';
    
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      borrowError.value = 'Vui lòng đăng nhập để mượn sách.';
      return;
    }
    
    const borrowData = {
      maDocGia: userId,
      maSach: book.value._id,
      ngayMuon: borrowForm.ngayMuon,
      ngayTra: borrowForm.ngayTra
    };
    
    await muonSachService.createMuonSach(borrowData);
    
    // Đóng modal
    showBorrowModal.value = false;
    
    // Hiển thị thông báo thành công và chuyển hướng đến trang lịch sử mượn
    alert('Đã gửi yêu cầu mượn sách thành công! Vui lòng chờ nhân viên duyệt.');
    router.push('/lich-su-muon');
  } catch (error) {
    console.error('Lỗi khi mượn sách:', error);
    borrowError.value = error.response?.data?.message || 'Không thể mượn sách. Vui lòng thử lại sau.';
  } finally {
    borrowLoading.value = false;
  }
};

onMounted(() => {
  fetchBookDetail();
});
</script>

<style scoped>
.book-detail-container {
  padding: 1rem 0;
}

.book-detail-content {
  display: flex;
  gap: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
}

.book-detail-left {
  flex: 0 0 300px;
}

.book-detail-right {
  flex: 1;
}

.book-cover {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  position: relative;
  padding-bottom: 0.5rem;
}

.book-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100px;
  height: 3px;
  background: var(--primary-gradient);
  border-radius: 3px;
}

.book-meta {
  margin-bottom: 2rem;
}

.book-meta-item {
  display: flex;
  margin-bottom: 0.75rem;
}

.meta-label {
  flex: 0 0 150px;
  font-weight: 600;
  color: #666;
}

.meta-value {
  flex: 1;
}

.text-error {
  color: var(--error-color);
  font-weight: 600;
}

.book-description {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.book-description h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
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

.borrow-book-info {
  margin-bottom: 1.5rem;
}

.borrow-book-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 992px) {
  .book-detail-content {
    flex-direction: column;
  }
  
  .book-detail-left {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .book-cover {
    max-width: 300px;
  }
  
  .book-actions {
    width: 100%;
    max-width: 300px;
  }
}
</style>