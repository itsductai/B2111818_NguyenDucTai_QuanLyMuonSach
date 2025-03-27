<template>
  <Layout page-title="Quản lý sách" :show-search="true" @search="handleSearch">
    <div class="book-management-container">
      <div class="action-bar">
        <div class="filters">
          <div class="filter-group">
            <label for="nhaXuatBan">Nhà xuất bản:</label>
            <select id="nhaXuatBan" class="form-control" v-model="filters.nhaXuatBan" @change="applyFilters">
              <option value="">Tất cả</option>
              <option v-for="nxb in nhaXuatBans" :key="nxb._id" :value="nxb._id">
                {{ nxb.tenNXB }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label for="sortBy">Sắp xếp theo:</label>
            <select id="sortBy" class="form-control" v-model="filters.sortBy" @change="applyFilters">
              <option value="tenSach">Tên sách</option>
              <option value="tacGia">Tác giả</option>
              <option value="namXuatBan">Năm xuất bản</option>
              <option value="donGia">Đơn giá</option>
              <option value="soQuyen">Số lượng</option>
            </select>
          </div>
          <div class="filter-group search-filter">
            <label for="searchInput">Tìm kiếm:</label>
            <div class="search-input-container">
              <input 
                type="text" 
                id="searchInput" 
                class="form-control" 
                v-model="localSearchQuery" 
                placeholder="Tìm theo tên, tác giả..."
                @input="debounceSearch"
              />
              <i class="fas fa-search search-icon"></i>
            </div>
          </div>
          <router-link to="/quan-ly/sach/them" class="btn btn-primary">
            <i class="fas fa-plus"></i> Thêm sách mới
          </router-link>
        </div>
      </div>

      <div class="alert alert-info" v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách sách...
      </div>

      <div class="alert alert-warning" v-if="!loading && books.length === 0">
        <i class="fas fa-exclamation-triangle"></i> Không tìm thấy sách nào.
      </div>

      <!-- Hiển thị dạng lưới với hình ảnh -->
      <div class="book-grid" v-if="!loading && books.length > 0 && viewMode === 'grid'">
        <div v-for="book in books" :key="book._id" class="book-card">
          <div class="book-card-image">
            <img :src="book.hinhAnh || '/placeholder.svg?height=200&width=150'" alt="Book Cover" />
            <span 
              class="book-quantity" 
              :class="{ 'quantity-low': book.soQuyen <= 0 }"
            >
              {{ book.soQuyen }} quyển
            </span>
          </div>
          <div class="book-card-content">
            <h3 class="book-title">{{ book.tenSach }}</h3>
            <p class="book-author">{{ book.tacGia }}</p>
            <p class="book-publisher">{{ book.maNXB?.tenNXB }}</p>
            <p class="book-year">Năm XB: {{ book.namXuatBan }}</p>
            <p class="book-price">{{ formatPrice(book.donGia) }}</p>
          </div>
          <div class="book-card-actions">
            <router-link :to="`/quan-ly/sach/${book._id}/sua`" class="btn btn-secondary btn-sm">
              <i class="fas fa-edit"></i> Sửa
            </router-link>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(book)">
              <i class="fas fa-trash-alt"></i> Xóa
            </button>
          </div>
        </div>
      </div>

      <!-- Hiển thị dạng bảng -->
      <div class="card" v-if="!loading && books.length > 0 && viewMode === 'table'">
        <div class="card-header">
          <div class="view-toggle">
            <button 
              class="btn btn-sm" 
              :class="viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'"
              @click="viewMode = 'table'"
            >
              <i class="fas fa-list"></i> Bảng
            </button>
            <button 
              class="btn btn-sm" 
              :class="viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'"
              @click="viewMode = 'grid'"
            >
              <i class="fas fa-th-large"></i> Lưới
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Mã sách</th>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Nhà xuất bản</th>
                  <th>Năm XB</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in books" :key="book._id">
                  <td>
                    <div class="book-thumbnail">
                      <img :src="book.hinhAnh || '/placeholder.svg?height=60&width=40'" alt="Book Cover" />
                    </div>
                  </td>
                  <td>{{ book.maSach }}</td>
                  <td>{{ book.tenSach }}</td>
                  <td>{{ book.tacGia }}</td>
                  <td>{{ book.maNXB?.tenNXB }}</td>
                  <td>{{ book.namXuatBan }}</td>
                  <td>
                    <span :class="{ 'text-error': book.soQuyen <= 0 }">
                      {{ book.soQuyen }}
                    </span>
                  </td>
                  <td>{{ formatPrice(book.donGia) }}</td>
                  <td>
                    <div class="action-buttons">
                      <router-link :to="`/quan-ly/sach/${book._id}/sua`" class="btn btn-secondary btn-sm">
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button class="btn btn-danger btn-sm" @click="confirmDelete(book)">
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

      <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages" @page-change="changePage" />

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
            <p>Bạn có chắc chắn muốn xóa sách này?</p>
            <div class="delete-book-info">
              <div class="delete-book-preview">
                <img :src="selectedBook?.hinhAnh || '/placeholder.svg?height=120&width=80'" alt="Book Cover" />
                <div class="delete-book-details">
                  <p><strong>Mã sách:</strong> {{ selectedBook?.maSach }}</p>
                  <p><strong>Tên sách:</strong> {{ selectedBook?.tenSach }}</p>
                  <p><strong>Tác giả:</strong> {{ selectedBook?.tacGia }}</p>
                </div>
              </div>
            </div>
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle"></i> Lưu ý: Hành động này không thể hoàn tác!
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteModal = false">Hủy</button>
            <button class="btn btn-danger" @click="deleteBook" :disabled="deleteLoading">
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
import { ref, reactive, onMounted, watch } from 'vue';
import Layout from '@/components/common/Layout.vue';
import Pagination from '@/components/common/Pagination.vue';
import sachService from '@/services/sach.service';
import nhaXuatBanService from '@/services/nhaXuatBan.service';

const books = ref([]);
const nhaXuatBans = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(10);
const searchQuery = ref('');
const localSearchQuery = ref('');
const viewMode = ref('grid'); // 'grid' hoặc 'table'
const filters = reactive({
  nhaXuatBan: '',
  sortBy: 'tenSach'
});
const showDeleteModal = ref(false);
const selectedBook = ref(null);
const deleteLoading = ref(false);
const deleteError = ref('');
let searchTimeout = null;

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
        if (filters.sortBy === 'donGia' || filters.sortBy === 'soQuyen' || filters.sortBy === 'namXuatBan') {
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

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery.value = localSearchQuery.value;
    currentPage.value = 1;
    fetchBooks();
  }, 300);
};

const handleSearch = (query) => {
  searchQuery.value = query;
  localSearchQuery.value = query;
  currentPage.value = 1;
  fetchBooks();
};

const applyFilters = () => {
  currentPage.value = 1;
  fetchBooks();
};

const changePage = (page) => {
  currentPage.value = page;
  fetchBooks();
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const confirmDelete = (book) => {
  selectedBook.value = book;
  showDeleteModal.value = true;
  deleteError.value = '';
};

const deleteBook = async () => {
  try {
    deleteLoading.value = true;
    deleteError.value = '';
    await sachService.deleteSach(selectedBook.value._id);
    // Đóng modal và cập nhật lại danh sách
    showDeleteModal.value = false;
    fetchBooks();
    // Hiển thị thông báo thành công
    alert('Xóa sách thành công!');
  } catch (error) {
    console.error('Lỗi khi xóa sách:', error);
    deleteError.value = error.response?.data?.message || 'Không thể xóa sách. Vui lòng thử lại sau.';
  } finally {
    deleteLoading.value = false;
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
.book-management-container {
  padding: 1rem 0;
  width: 100%;
}

.action-bar {
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
  align-items: flex-end;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.search-filter {
  flex: 2;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.search-input-container {
  position: relative;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

/* Hiển thị dạng lưới */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.book-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.book-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-quantity {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.quantity-low {
  background-color: rgba(244, 67, 54, 0.9);
}

.book-card-content {
  padding: 1rem;
  flex: 1;
}

.book-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.8rem;
}

.book-author, .book-publisher, .book-year {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-price {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0.5rem 0 0 0;
}

.book-card-actions {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
}

/* Hiển thị dạng bảng */
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

.card-body {
  padding: 1rem;
}

.book-thumbnail {
  width: 40px;
  height: 60px;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #eee;
}

.book-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-error {
  color: var(--error-color);
  font-weight: 600;
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

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  white-space: nowrap;
  background-color: #f5f5f5;
  font-weight: 600;
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid var(--border-color);
}

.table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
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

.delete-book-info {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.delete-book-preview {
  display: flex;
  gap: 1rem;
}

.delete-book-preview img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.delete-book-details {
  flex: 1;
}

.delete-book-details p {
  margin: 0 0 0.5rem 0;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .book-card-image {
    height: 180px;
  }
  
  .delete-book-preview {
    flex-direction: column;
    align-items: center;
  }
  
  .delete-book-preview img {
    margin-bottom: 1rem;
  }
}
</style>