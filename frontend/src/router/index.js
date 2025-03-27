import { createRouter, createWebHistory } from 'vue-router';
import authService from '@/services/auth.services';

// Trang Auth
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';

// Trang Dashboard
import Dashboard from '@/views/dashboard/Dashboard.vue';

// Trang Profile
import Profile from '@/views/profile/Profile.vue';

// Trang cho Độc giả
import DanhSachSach from '@/views/reader/DanhSachSach.vue';
import ChiTietSach from '@/views/reader/ChiTietSach.vue';
import LichSuMuonSach from '@/views/reader/LichSuMuonSach.vue';

// Trang cho Admin/Nhân viên
import QuanLySach from '@/views/admin/QuanLySach.vue';
import SachForm from '@/views/admin/SachForm.vue';
import QuanLyNhaXuatBan from '@/views/admin/QuanLyNhaXuatBan.vue';
import NhaXuatBanForm from '@/views/admin/NhaXuatBanForm.vue';
import QuanLyDocGia from '@/views/admin/QuanLyDocGia.vue';
import ChiTietDocGia from '@/views/admin/ChiTietDocGia.vue';
import QuanLyMuonSach from '@/views/admin/QuanLyMuonSach.vue';
import ChiTietMuonSach from '@/views/admin/ChiTietMuonSach.vue';
import QuanLyNhanVien from '@/views/admin/QuanLyNhanVien.vue';
import NhanVienForm from '@/views/admin/NhanVienForm.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/thong-tin-ca-nhan',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  
  // Routes cho Độc giả
  {
    path: '/sach',
    name: 'DanhSachSach',
    component: DanhSachSach,
    meta: { requiresAuth: true, role: 'DocGia' }
  },
  {
    path: '/sach/:id',
    name: 'ChiTietSach',
    component: ChiTietSach,
    meta: { requiresAuth: true, role: 'DocGia' }
  },
  {
    path: '/lich-su-muon',
    name: 'LichSuMuonSach',
    component: LichSuMuonSach,
    meta: { requiresAuth: true, role: 'DocGia' }
  },
  
  // Routes cho Admin/Nhân viên
  {
    path: '/quan-ly/sach',
    name: 'QuanLySach',
    component: QuanLySach,
    meta: { requiresAuth: true, role: 'NhanVien' }
  },
  {
    path: '/quan-ly/sach/them',
    name: 'ThemSach',
    component: SachForm,
    meta: { requiresAuth: true, role: 'NhanVien' }
  },
  {
    path: '/quan-ly/sach/:id/sua',
    name: 'SuaSach',
    component: SachForm,
    meta: { requiresAuth: true, role: 'NhanVien' }
  },
  {
    path: '/quan-ly/nha-xuat-ban',
    name: 'QuanLyNhaXuatBan',
    component: QuanLyNhaXuatBan,
    meta: { requiresAuth: true, role: 'NhanVien' }
  },
  {
    path: '/quan-ly/nha-xuat-ban/them',
    name: 'ThemNhaXuatBan',
    component: NhaXuatBanForm,
    meta: { requiresAuth: true, role: 'NhanVien' }
  },
  {
    path: '/quan-ly/nha-xuat-ban/:id/sua',
    name: 'SuaNhaXuatBan',
    component: NhaXuatBanForm,
    meta: { requiresAuth: true, role: 'NhanVien' }
  },
  {
    path: '/quan-ly/doc-gia',
    name: 'QuanLyDocGia',
    component: QuanLyDocGia,
    meta: { requiresAuth: true, role: 'NhanVien' }
  },
  {
    path: '/quan-ly/doc-gia/:id',
    name: 'ChiTietDocGia',
    component: ChiTietDocGia,
    meta: { requiresAuth: true, role: 'NhanVien' }
  },
  {
    path: '/quan-ly/muon-sach',
    name: 'QuanLyMuonSach',
    component: QuanLyMuonSach,
    meta: { requiresAuth: true, role: 'NhanVien' }
  },
  {
    path: '/quan-ly/muon-sach/:id',
    name: 'ChiTietMuonSach',
    component: ChiTietMuonSach,
    meta: { requiresAuth: true, role: 'NhanVien' }
  },
  {
    path: '/quan-ly/nhan-vien',
    name: 'QuanLyNhanVien',
    component: QuanLyNhanVien,
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/quan-ly/nhan-vien/them',
    name: 'ThemNhanVien',
    component: NhanVienForm,
    meta: { requiresAuth: true, role: 'Admin' }
  },
  {
    path: '/quan-ly/nhan-vien/:id/sua',
    name: 'SuaNhanVien',
    component: NhanVienForm,
    meta: { requiresAuth: true, role: 'Admin' }
  },
  
  // Route mặc định cho 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.checkAuth();
  const userType = authService.getUserType();
  const user = authService.getCurrentUser();
  
  // Kiểm tra xem route có yêu cầu đăng nhập hay không
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } 
  // Kiểm tra quyền truy cập dựa trên vai trò
  else if (to.meta.role) {
    if (to.meta.role === 'Admin' && userType === 'NhanVien' && user?.chucVu === 'Admin') {
      next();
    } else if (to.meta.role === 'NhanVien' && userType === 'NhanVien') {
      next();
    } else if (to.meta.role === 'DocGia' && userType === 'DocGia') {
      next();
    } else {
      next('/dashboard');
    }
  } else {
    next();
  }
});

export default router;