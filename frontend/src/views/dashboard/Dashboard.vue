<template>
  <div>
    <AdminDashboard v-if="isAdmin" />
    <NhanVienDashboard v-else-if="isNhanVien" />
    <DocGiaDashboard v-else-if="isDocGia" />
    <div v-else class="unauthorized">
      <h1>Không có quyền truy cập</h1>
      <p>Vui lòng đăng nhập để tiếp tục.</p>
      <router-link to="/login" class="btn btn-primary">Đăng nhập</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AdminDashboard from './AdminDashboard.vue';
import NhanVienDashboard from './NhanVienDashboard.vue';
import DocGiaDashboard from './DocGiaDashboard.vue';
import authService from '@/services/auth.services';

const userType = computed(() => {
  return authService.getUserType();
});

const user = computed(() => {
  return authService.getCurrentUser();
});

const isAdmin = computed(() => {
  return userType.value === 'NhanVien' && user.value?.chucVu === 'Admin';
});

const isNhanVien = computed(() => {
  return userType.value === 'NhanVien' && user.value?.chucVu !== 'Admin';
});

const isDocGia = computed(() => {
  return userType.value === 'DocGia';
});
</script>

<style scoped>
.unauthorized {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
}

.unauthorized h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--error-color);
}

.unauthorized p {
  margin-bottom: 2rem;
  color: #666;
}
</style>