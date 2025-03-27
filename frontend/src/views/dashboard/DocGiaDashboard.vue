<template>
  <Layout page-title="Trang chủ">
    <div class="dashboard">
      <div class="welcome-card">
        <div class="welcome-content">
          <h1 class="welcome-title">Xin chào, {{ userName }}!</h1>
          <p class="welcome-text">Chào mừng bạn đến với Hệ thống Quản lý Thư viện</p>
        </div>
        <div class="welcome-image">
          <img src="" alt="Welcome" />
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-book"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.totalBooks }}</h3>
            <p class="stat-label">Tổng số sách</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-book-reader"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.borrowedBooks }}</h3>
            <p class="stat-label">Sách đang mượn</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-history"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.totalBorrows }}</h3>
            <p class="stat-label">Lịch sử mượn</p>
          </div>
        </div>
      </div>
      
      <div class="dashboard-row">
        <div class="dashboard-col">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Sách đang mượn</h2>
              <router-link to="/lich-su-muon" class="btn btn-secondary btn-sm">
                Xem tất cả
              </router-link>
            </div>
            <div class="card-body">
              <table class="table">
                <thead>
                  <tr>
                    <th>Tên sách</th>
                    <th>Ngày mượn</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="currentBorrows.length === 0">
                    <td colspan="4" class="text-center">Bạn chưa mượn sách nào</td>
                  </tr>
                  <tr v-for="borrow in currentBorrows" :key="borrow._id">
                    <td>{{ borrow.maSach?.tenSach }}</td>
                    <td>{{ formatDate(borrow.ngayMuon) }}</td>
                    <td>
                      <span 
                        class="status-badge" 
                        :class="{
                          'status-pending': borrow.tinhTrang === 'Chưa duyệt',
                          'status-approved': borrow.tinhTrang === 'Đã duyệt',
                          'status-returned': borrow.tinhTrang === 'Đã trả'
                        }"
                      >
                        {{ borrow.tinhTrang }}
                      </span>
                    </td>
                    <td>
                      <button 
                        v-if="borrow.tinhTrang === 'Đã duyệt'" 
                        class="btn btn-primary btn-sm"
                        @click="returnBook(borrow._id)"
                      >
                        Trả sách
                      </button>
                      <button 
                        v-else-if="borrow.tinhTrang === 'Chưa duyệt'" 
                        class="btn btn-danger btn-sm"
                        @click="cancelBorrow(borrow._id)"
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
        </div>
        
        <div class="dashboard-col">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Sách đề xuất</h2>
              <router-link to="/sach" class="btn btn-secondary btn-sm">
                Xem tất cả
              </router-link>
            </div>
            <div class="card-body">
              <div class="recommended-books">
                <div v-if="recommendedBooks.length === 0" class="text-center">
                  Không có sách đề xuất
                </div>
                <div v-for="book in recommendedBooks" :key="book._id" class="book-card">
                  <div class="book-cover">
                    <img :src="book.hinhAnh || '/placeholder.jpg'" alt="Book Cover" />
                  </div>
                  <div class="book-info">
                    <h3 class="book-title">{{ book.tenSach }}</h3>
                    <p class="book-author">{{ book.tacGia }}</p>
                    <router-link :to="`/sach/${book._id}`" class="btn btn-primary btn-sm">
                      Xem chi tiết
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Layout from '@/components/common/Layout.vue';
import sachService from '@/services/sach.service';
import muonSachService from '@/services/muonSach.service';
import authService from '@/services/auth.services';

const stats = ref({
  totalBooks: 0,
  borrowedBooks: 0,
  totalBorrows: 0
});

const currentBorrows = ref([]);
const recommendedBooks = ref([]);

const user = computed(() => {
  return authService.getCurrentUser();
});

const userName = computed(() => {
  if (user.value) {
    return `${user.value.hoLot} ${user.value.ten}`;
  }
  return '';
});

const userId = computed(() => {
  return localStorage.getItem('userId');
});

onMounted(async () => {
  try {
    // Lấy thống kê
    const [books, borrows] = await Promise.all([
      sachService.getSachs(),
      muonSachService.getDocGiaMuonSachs(userId.value)
    ]);
    
    // Cập nhật thống kê
    stats.value.totalBooks = books.sach?.length || 0;
    stats.value.totalBorrows = borrows.theoDoiMuonSach?.length || 0;
    stats.value.borrowedBooks = borrows.theoDoiMuonSach?.filter(b => 
      b.tinhTrang === 'Đã duyệt' || b.tinhTrang === 'Chưa duyệt'
    ).length || 0;
    
    // Lấy sách đang mượn
    currentBorrows.value = borrows.theoDoiMuonSach
      ?.filter(b => b.tinhTrang !== 'Đã trả')
      .slice(0, 5) || [];
    
    // Lấy sách đề xuất (ở đây chỉ lấy ngẫu nhiên 3 cuốn)
    recommendedBooks.value = books.sach
      ?.sort(() => 0.5 - Math.random())
      .slice(0, 3) || [];
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu dashboard:', error);
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const returnBook = async (borrowId) => {
  try {
    await muonSachService.updateMuonSach(borrowId, {
      tinhTrang: 'Đã trả',
      ngayTra: new Date().toISOString().split('T')[0]
    });
    
    // Cập nhật lại danh sách
    const borrows = await muonSachService.getDocGiaMuonSachs(userId.value);
    currentBorrows.value = borrows.theoDoiMuonSach
      ?.filter(b => b.tinhTrang !== 'Đã trả')
      .slice(0, 5) || [];
    
    // Cập nhật thống kê
    stats.value.borrowedBooks = borrows.theoDoiMuonSach?.filter(b => 
      b.tinhTrang === 'Đã duyệt' || b.tinhTrang === 'Chưa duyệt'
    ).length || 0;
  } catch (error) {
    console.error('Lỗi khi trả sách:', error);
  }
};

const cancelBorrow = async (borrowId) => {
  try {
    await muonSachService.updateMuonSach(borrowId, {
      tinhTrang: 'Đã hủy'
    });
    
    // Cập nhật lại danh sách
    const borrows = await muonSachService.getDocGiaMuonSachs(userId.value);
    currentBorrows.value = borrows.theoDoiMuonSach
      ?.filter(b => b.tinhTrang !== 'Đã trả' && b.tinhTrang !== 'Đã hủy')
      .slice(0, 5) || [];
    
    // Cập nhật thống kê
    stats.value.borrowedBooks = borrows.theoDoiMuonSach?.filter(b => 
      b.tinhTrang === 'Đã duyệt' || b.tinhTrang === 'Chưa duyệt'
    ).length || 0;
  } catch (error) {
    console.error('Lỗi khi hủy phiếu mượn:', error);
  }
};
</script>

<style scoped>
.dashboard {
  padding: 1rem 0;
}

.welcome-card {
  background: var(--primary-gradient);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.welcome-text {
  font-size: 1.1rem;
  opacity: 0.9;
}

.welcome-image {
  width: 150px;
}

.welcome-image img {
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.recommended-books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.book-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  height: 150px;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  padding: 1rem;
}

.book-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-author {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.75rem;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .welcome-card {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-image {
    margin-top: 1rem;
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