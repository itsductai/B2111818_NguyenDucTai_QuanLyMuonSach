<template>
  <Layout page-title="Quản lý nhà xuất bản" :show-search="true" @search="handleSearch">
    <div class="publisher-management-container">
      <div class="action-bar">
        <div class="filters">
          <div class="filter-group">
            <label for="sortBy">Sắp xếp theo:</label>
            <select id="sortBy" class="form-control" v-model="sortBy">
              <option value="tenNXB">Tên nhà xuất bản</option>
              <option value="maNXB">Mã nhà xuất bản</option>
              <option value="diaChi">Địa chỉ</option>
            </select>
          </div>

          <router-link to="/quan-ly/nha-xuat-ban/them" class="btn btn-primary">
          <i class="fas fa-plus"></i> Thêm nhà xuất bản mới
          </router-link>
        </div>
        
        
      </div>
      
      <div class="alert alert-info" v-if="loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách nhà xuất bản...
      </div>
      
      <div class="alert alert-warning" v-if="!loading && publishers.length === 0">
        <i class="fas fa-exclamation-triangle"></i> Không tìm thấy nhà xuất bản nào.
      </div>
      
      <div class="card" v-if="!loading && publishers.length > 0">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Mã NXB</th>
                  <th>Tên nhà xuất bản</th>
                  <th>Địa chỉ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="publisher in publishers" :key="publisher._id">
                  <td>{{ publisher.maNXB }}</td>
                  <td>{{ publisher.tenNXB }}</td>
                  <td>{{ publisher.diaChi }}</td>
                  <td>
                    <div class="action-buttons">
                      <router-link :to="`/quan-ly/nha-xuat-ban/${publisher._id}/sua`" class="btn btn-secondary btn-sm">
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button 
                        class="btn btn-danger btn-sm" 
                        @click="confirmDelete(publisher)"
                        :disabled="publisher.soLuongSach > 0"
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
            
            <p>Bạn có chắc chắn muốn xóa nhà xuất bản này?</p>
            
            <div class="delete-publisher-info">
              <p><strong>Mã NXB:</strong> {{ selectedPublisher?.maNXB }}</p>
              <p><strong>Tên nhà xuất bản:</strong> {{ selectedPublisher?.tenNXB }}</p>
              <p><strong>Địa chỉ:</strong> {{ selectedPublisher?.diaChi }}</p>
            </div>
            
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle"></i> Lưu ý: Hành động này không thể hoàn tác!
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showDeleteModal = false">Hủy</button>
            <button class="btn btn-danger" @click="deletePublisher" :disabled="deleteLoading">
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
import { ref, onMounted, watch } from 'vue';
import Layout from '@/components/common/Layout.vue';
import Pagination from '@/components/common/Pagination.vue';
import nhaXuatBanService from '@/services/nhaXuatBan.service';
import sachService from '@/services/sach.service';

const publishers = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = ref(10);
const searchQuery = ref('');
const sortBy = ref('tenNXB');

const showDeleteModal = ref(false);
const selectedPublisher = ref(null);
const deleteLoading = ref(false);
const deleteError = ref('');

const fetchPublishers = async () => {
  try {
    loading.value = true;
    
    let params = {
      page: currentPage.value,
      limit: limit.value
    };
    
    const response = await nhaXuatBanService.getNhaXuatBans(params);
    
    publishers.value = response.nhaXuatBan || [];
    
    // Lấy số lượng sách cho mỗi nhà xuất bản
    for (const publisher of publishers.value) {
      try {
        const booksResponse = await sachService.getSachs({ maNXB: publisher._id });
        publisher.soLuongSach = booksResponse.sach?.length || 0;
      } catch (error) {
        console.error(`Lỗi khi lấy số lượng sách cho NXB ${publisher.tenNXB}:`, error);
        publisher.soLuongSach = 0;
      }
    }
    
    // Sắp xếp nhà xuất bản theo bộ lọc
    if (sortBy.value) {
      publishers.value.sort((a, b) => {
        return a[sortBy.value]?.localeCompare(b[sortBy.value]);
      });
    }
    
    const total = response.total || 0;
    totalPages.value = Math.ceil(total / limit.value);
  } catch (error) {
    console.error('Lỗi khi tải danh sách nhà xuất bản:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
  fetchPublishers();
};

const changePage = (page) => {
  currentPage.value = page;
  fetchPublishers();
};

const confirmDelete = (publisher) => {
  selectedPublisher.value = publisher;
  showDeleteModal.value = true;
  deleteError.value = '';
};

const deletePublisher = async () => {
  try {
    deleteLoading.value = true;
    deleteError.value = '';
    
    await nhaXuatBanService.deleteNhaXuatBan(selectedPublisher.value._id);
    
    // Đóng modal và cập nhật lại danh sách
    showDeleteModal.value = false;
    fetchPublishers();
    
    // Hiển thị thông báo thành công
    alert('Xóa nhà xuất bản thành công!');
  } catch (error) {
    console.error('Lỗi khi xóa nhà xuất bản:', error);
    deleteError.value = error.response?.data?.message || 'Không thể xóa nhà xuất bản. Vui lòng thử lại sau.';
  } finally {
    deleteLoading.value = false;
  }
};

watch(() => sortBy.value, () => {
  fetchPublishers();
});

onMounted(() => {
  fetchPublishers();
});
</script>

<style scoped>
.publisher-management-container {
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

.delete-publisher-info {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>