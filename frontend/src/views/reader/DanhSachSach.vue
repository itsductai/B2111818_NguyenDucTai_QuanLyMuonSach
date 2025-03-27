<template>
  <Layout page-title="Danh sách sách" :show-search="true" @search="handleSearch">
    <div class="book-list-container">
      <div class="filters">
        <div class="filter-group">
          <label for="nhaXuatBan">Nhà xuất bản:</label>
          <select id="nhaXuatBan" class="form-control" v-model="filters.nhaXuatBan">
            <option value="">Tất cả</option>
            <option v-for="nxb in nhaXuatBans" :key="nxb._id" :value="nxb._id">
              {{ nxb.tenNXB }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label for="sortBy">Sắp xếp theo:</label>
          <select id="sortBy" class="form-control" v-model="filters.sortBy">
            <option value="tenSach">Tên sách</option>
            <option value="tacGia">Tác giả</option>
            <option value="namXuatBan">Năm xuất bản</option>
            <option value="donGia">Đơn giá</option>
          </select>
        </div>
        <button class="btn btn-secondary" @click="resetFilters">
          <i class="fas fa-sync-alt"></i> Đặt lại
        </button>
      </div>

      <div class="alert alert-info" v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách sách...
      </div>

      <div class="alert alert-warning" v-if="!loading && books.length === 0">
        <i class="fas fa-exclamation-triangle"></i> Không tìm thấy sách nào.
      </div>

      <div class="books-grid" v-if="!loading && books.length > 0">
        <div v-for="book in books" :key="book._id" class="book-card">
          <div class="book-cover">
            <img :src="book.hinhAnh || '/placeholder.jpg'" alt="Book Cover" />
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.tenSach }}</h3>
            <p class="book-author">{{ book.tacGia }}</p>
            <p class="book-publisher">{{ book.maNXB?.tenNXB }}</p>
            <div class="book-details">
              <span class="book-year"><i class="fas fa-calendar-alt"></i> {{ book.namXuatBan }}</span>
              <span class="book-price"><i class="fas fa-tag"></i> {{ formatPrice(book.donGia) }}</span>
            </div>
            <div class="book-actions">
              <router-link :to="`/sach/${book._id}`" class="btn btn-primary btn-sm">
                Xem chi tiết
              </router-link>
              <button class="btn btn-secondary btn-sm" @click="borrowBook(book)" :disabled="book.soQuyen <= 0">
                <span v-if="book.soQuyen > 0">Mượn sách</span>
                <span v-else>Hết sách</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />

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
              <h3>{{ selectedBook?.tenSach }}</h3>
              <p><strong>Tác giả:</strong> {{ selectedBook?.tacGia }}</p>
              <p><strong>Nhà xuất bản:</strong> {{ selectedBook?.maNXB?.tenNXB }}</p>
            </div>
            <div class="form-group">
              <label for="ngayMuon">Ngày mượn:</label>
              <input type="date" id="ngayMuon" class="form-control" v-model="borrowForm.ngayMuon" :min="today" required />
            </div>
            <div class="form-group">
              <label for="ngayTra">Ngày trả (dự kiến):</label>
              <input type="date" id="ngayTra" class="form-control" v-model="borrowForm.ngayTra" :min="borrowForm.ngayMuon" required />
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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import Layout from '@/components/common/Layout.vue';
import Pagination from '@/components/common/Pagination.vue';
import sachService from '@/services/sach.service';
import nhaXuatBanService from '@/services/nhaXuatBan.service';
import muonSachService from '@/services/muonSach.service';

const books = ref([]);
const nhaXuatBans = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(12);
const searchQuery = ref('');
const filters = reactive({
  nhaXuatBan: '',
  sortBy: 'tenSach'
});
const showBorrowModal = ref(false);
const selectedBook = ref(null);
const borrowLoading = ref(false);
const borrowError = ref('');
const borrowForm = reactive({
  ngayMuon: new Date().toISOString().split('T')[0],
  ngayTra: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
});

const today = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const fetchBooks = async () => {
  try {
    loading.value = true;
    let params = {
      page: currentPage.value,
      limit: limit.value
    };
    
    if (filters.nhaXuatBan) {
      params.maNXB = filters.nhaXuatBan;
    }
    
    let response;
    if (searchQuery.value) {
      response = await sachService.searchSachs(searchQuery.value);
    } else {
      response = await sachService.getSachs(params);
    }
    
    books.value = response.sach || [];
    
    // Sắp xếp sách theo bộ lọc
    if (filters.sortBy) {
      books.value.sort((a, b) => {
        if (filters.sortBy === 'donGia') {
          return a[filters.sortBy] - b[filters.sortBy];
        } else {
          return a[filters.sortBy]?.localeCompare(b[filters.sortBy]);
        }
      });
    }
    
    const total = response.total || 0;
    totalPages.value = Math.ceil(total / limit.value);
  } catch (error) {
    console.error('Lỗi khi tải danh sách sách:', error);
  } finally {
    loading.value = false;
  }
};

const fetchNhaXuatBans = async () => {
  try {
    const response = await nhaXuatBanService.getNhaXuatBans();
    nhaXuatBans.value = response.nhaXuatBan || [];
  } catch (error) {
    console.error('Lỗi khi tải danh sách nhà xuất bản:', error);
  }
};

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
  fetchBooks();
};

const changePage = (page) => {
  currentPage.value = page;
  fetchBooks();
};

const resetFilters = () => {
  filters.nhaXuatBan = '';
  filters.sortBy = 'tenSach';
  searchQuery.value = '';
  currentPage.value = 1;
  fetchBooks();
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const borrowBook = (book) => {
  selectedBook.value = book;
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
      maSach: selectedBook.value._id,
      ngayMuon: borrowForm.ngayMuon,
      ngayTra: borrowForm.ngayTra
    };
    
    await muonSachService.createMuonSach(borrowData);
    
    // Đóng modal và cập nhật lại danh sách sách
    showBorrowModal.value = false;
    fetchBooks();
    
    // Hiển thị thông báo thành công
    alert('Đã gửi yêu cầu mượn sách thành công! Vui lòng chờ nhân viên duyệt.');
  } catch (error) {
    console.error('Lỗi khi mượn sách:', error);
    borrowError.value = error.response?.data?.message || 'Không thể mượn sách. Vui lòng thử lại sau.';
  } finally {
    borrowLoading.value = false;
  }
};

watch(() => filters.nhaXuatBan, () => {
  currentPage.value = 1;
  fetchBooks();
});

watch(() => filters.sortBy, () => {
  fetchBooks();
});

onMounted(() => {
  fetchBooks();
  fetchNhaXuatBans();
});
</script>

<style scoped>
.book-list-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.book-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.book-cover {
  height: 200px;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

.book-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.book-author {
  font-size: 0.9rem;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.book-publisher {
  font-size: 0.85rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.book-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--text-color);
}

.book-actions {
  margin-top: auto;
  display: flex;
  gap: 0.5rem;
}

.book-actions .btn {
  flex: 1;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.875rem;
}

@media (max-width: 992px) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .books-grid {
    grid-template-columns: 1fr;
  }
}
</style>