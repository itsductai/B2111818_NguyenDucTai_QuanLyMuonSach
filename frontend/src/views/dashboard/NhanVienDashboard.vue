<template>
  <Layout page-title="Trang chủ">
    <div class="dashboard">
      <div class="stats-grid">
        <div class="stat-card" v-for="(stat, index) in stats" :key="index">
          <div class="stat-icon">
            <i :class="'fas ' + stat.icon"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stat.value }}</h3>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </div>
      </div>
      
      <div class="dashboard-row">
        <div class="dashboard-col">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Phiếu mượn chờ duyệt</h2>
              <router-link to="/quan-ly/muon-sach" class="btn btn-secondary btn-sm">
                Xem tất cả
              </router-link>
            </div>
            <div class="card-body">
              <table class="table">
                <thead>
                  <tr>
                    <th>Độc giả</th>
                    <th>Sách</th>
                    <th>Ngày mượn</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="pendingBorrows.length === 0">
                    <td colspan="4" class="text-center">Không có phiếu mượn nào chờ duyệt</td>
                  </tr>
                  <tr v-for="borrow in pendingBorrows" :key="borrow._id">
                    <td>{{ borrow.docGia?.hoLot }} {{ borrow.docGia?.ten }}</td>
                    <td>{{ borrow.sach?.tenSach }}</td>
                    <td>{{ formatDate(borrow.ngayMuon) }}</td>
                    <td>
                      <router-link :to="`/quan-ly/muon-sach/${borrow._id}`" class="btn btn-primary btn-sm">
                        Xem chi tiết
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="dashboard-col">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Sách mới nhất</h2>
              <router-link to="/quan-ly/sach" class="btn btn-secondary btn-sm">
                Xem tất cả
              </router-link>
            </div>
            <div class="card-body">
              <table class="table">
                <thead>
                  <tr>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="latestBooks.length === 0">
                    <td colspan="3" class="text-center">Không có sách nào</td>
                  </tr>
                  <tr v-for="book in latestBooks" :key="book._id">
                    <td>{{ book.tenSach }}</td>
                    <td>{{ book.tacGia }}</td>
                    <td>{{ book.soQuyen }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Layout from '@/components/common/Layout.vue';
import sachService from '@/services/sach.service';
import muonSachService from '@/services/muonSach.service';
import docGiaService from '@/services/docGia.service';

const stats = ref([
  { label: 'Tổng số sách', value: 0, icon: 'fa-book' },
  { label: 'Tổng số độc giả', value: 0, icon: 'fa-users' },
  { label: 'Phiếu mượn chờ duyệt', value: 0, icon: 'fa-clock' },
  { label: 'Tổng số phiếu mượn', value: 0, icon: 'fa-clipboard-list' }
]);

const pendingBorrows = ref([]);
const latestBooks = ref([]);

onMounted(async () => {
  try {
    // Lấy thống kê
    const [books, readers, borrows, pendingBorrowsData] = await Promise.all([
      sachService.getSachs(),
      docGiaService.getDocGias(),
      muonSachService.getMuonSachs(),
      muonSachService.getMuonSachs({ tinhTrang: 'Chưa duyệt' })
    ]);
    
    // Cập nhật thống kê
    stats.value[0].value = books.sach?.length || 0;
    stats.value[1].value = readers.docGia?.length || 0;
    stats.value[2].value = pendingBorrowsData.theoDoiMuonSach?.length || 0;
    stats.value[3].value = borrows.theoDoiMuonSach?.length || 0;
    
    // Lấy phiếu mượn chờ duyệt
    pendingBorrows.value = pendingBorrowsData.theoDoiMuonSach?.slice(0, 5) || [];
    
    // Lấy sách mới nhất
    latestBooks.value = books.sach?.slice(0, 5) || [];
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu dashboard:', error);
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};
</script>

<style scoped>
.dashboard {
  padding: 1rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 1.5rem;
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.stat-icon i {
  font-size: 1.5rem;
  color: white;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #666;
  font-size: 0.875rem;
}

.dashboard-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.dashboard-col {
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.875rem;
}

.text-center {
  text-align: center;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-row {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>