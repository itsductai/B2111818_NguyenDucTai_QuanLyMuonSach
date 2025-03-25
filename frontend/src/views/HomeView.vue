<template>
  <div class="home">
    <h1>Chào mừng đến với hệ thống Quản lý mượn sách</h1>
    <div class="mt-4">
      <RouterLink to="/sach" class="btn btn-primary">
        Quản lý sách
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'HomeView',
  components: {
    RouterLink
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}
</style> 