<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <h2 class="logo">Thư Viện</h2>
      </div>
      
      <div class="navbar-menu">
        <ul class="menu">
          <li v-for="item in menuItems" :key="item.path" :class="{ active: isActive(item.path) }">
            <router-link :to="item.path">
              <i :class="'fas ' + item.icon"></i>
              <span>{{ item.title }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      
      <div class="navbar-user">
        <div class="user-info">
          <div class="avatar">{{ userInitials }}</div>
          <div class="user-details">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRole }}</div>
          </div>
        </div>
        
        <button class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isActive = (path) => {
  return route.path.startsWith(path);
};

const logout = () => {
  localStorage.removeItem('userType');
  localStorage.removeItem('userId');
  localStorage.removeItem('user');
  router.push('/login');
};

const userType = computed(() => {
  return localStorage.getItem('userType') || '';
});

const user = computed(() => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : {};
});

const userName = computed(() => {
  if (userType.value === 'DocGia') {
    return `${user.value.hoLot} ${user.value.ten}`;
  } else {
    return `${user.value.hoTenNV || 'Người dùng'}`;
  }
});

const userInitials = computed(() => {
  if (userType.value === 'DocGia' && user.value.ten) {
    return user.value.ten.charAt(0);
  } else if (user.value.hoTenNV) {
    const nameParts = user.value.hoTenNV.split(' ');
    return nameParts[nameParts.length - 1].charAt(0);
  }
  return 'U';
});

const userRole = computed(() => {
  switch (userType.value) {
    case 'DocGia':
      return 'Độc giả';
    case 'NhanVien':
      return user.value.chucVu === 'Admin' ? 'Quản trị viên' : 'Nhân viên';
    default:
      return 'Khách';
  }
});

const menuItems = computed(() => {
  const items = [];
  
  // Menu chung
  items.push({
    title: 'Trang chủ',
    path: '/dashboard',
    icon: 'fa-home'
  });
  
  if (userType.value === 'DocGia') {
    // Menu độc giả
    items.push({
      title: 'Danh sách sách',
      path: '/sach',
      icon: 'fa-book'
    });
    items.push({
      title: 'Phiếu mượn',
      path: '/lich-su-muon',
      icon: 'fa-history'
    });
    items.push({
      title: 'Thông tin cá nhân',
      path: '/thong-tin-ca-nhan',
      icon: 'fa-user'
    });
  } else if (userType.value === 'NhanVien') {
    // Menu nhân viên
    items.push({
      title: 'Sách',
      path: '/quan-ly/sach',
      icon: 'fa-book'
    });
    items.push({
      title: 'Nhà xuất bản',
      path: '/quan-ly/nha-xuat-ban',
      icon: 'fa-building'
    });
    items.push({
      title: 'Độc giả',
      path: '/quan-ly/doc-gia',
      icon: 'fa-users'
    });
    items.push({
      title: 'Phiếu mượn',
      path: '/quan-ly/muon-sach',
      icon: 'fa-clipboard-list'
    });
    items.push({
      title: 'Thông tin cá nhân',
      path: '/thong-tin-ca-nhan',
      icon: 'fa-user'
    });
    
    // Nếu là admin, thêm quản lý nhân viên
    if (user.value.chucVu === 'Admin') {
      items.push({
        title: 'Nhân viên',
        path: '/quan-ly/nhan-vien',
        icon: 'fa-user-tie'
      });
    }
  }
  
  return items;
});
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 1rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
  width: 150px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

.navbar-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.menu {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.menu li {
  margin: 0;
  width: 120px; /* Kích thước cố định cho mỗi mục menu */
  text-align: center;
}

.menu li a {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 60px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.menu li a:hover {
  background-color: rgba(255, 135, 125, 0.1);
}

.menu li.active a {
  color: var(--primary-color);
  border-bottom: 3px solid var(--primary-color);
}

.menu li i {
  font-size: 16px;
  margin-bottom: 4px;
}

.menu li span {
  font-size: 14px;
}

.navbar-user {
  display: flex;
  align-items: center;
  width: 250px;
  justify-content: flex-end;
}

.user-info {
  display: flex;
  align-items: center;
  margin-right: 15px;
  
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--primary-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  color: #666;
}

.logout-btn {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-color);
}

.logout-btn:hover {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--error-color);
  border-color: var(--error-color);
}

.logout-btn i {
  margin-right: 8px;
}

@media (max-width: 756px) {

  .user-details {
    display: flex !important;
  }
  
  /* Ẩn chữ trong menu, chỉ giữ icon */
  .menu li span {
    display: none;
  }

  /* Menu vẫn nằm ngang, không wrap xuống hàng */
  .menu {
    flex-wrap: nowrap;
    overflow-x: auto;
    justify-content: center;
  }

  .menu li {
    width: auto;
    text-align: center;
  }

  .menu li a {
    height: 60px;
    padding: 0 12px;
    flex-direction: column;
    justify-content: center;
  }

  .menu li i {
    margin-bottom: 0;
    font-size: 18px;
  }

  /* Avatar và user info rút gọn */
  .user-details {
    display: none;
  }

  /* Nút đăng xuất vẫn hiển thị icon, có thể giữ span hoặc ẩn tùy bạn */
  .logout-btn span {
    display: none;
  }

  .logout-btn i {
    margin-right: 0;
  }

  /* Đảm bảo bố cục không vỡ */
  .navbar-container {
    padding: 0 0.5rem;
  }
}


</style>