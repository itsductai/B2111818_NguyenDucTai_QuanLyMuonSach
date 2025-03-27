<template>
  <div class="layout-container">
    <Sidebar class="navbar" />
    <div class="content-wrapper">
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import Sidebar from './SideBar.vue';

const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Trang chủ'
  },
  showSearch: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['search']);

const handleSearch = (query) => {
  emit('search', query);
};
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  height: auto;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-light);
  width: 100%;
  margin-top: 60px; /* Để tránh bị che bởi navbar */
}

.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
</style>