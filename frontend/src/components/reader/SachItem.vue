<template>
  <div class="book-card">
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
        <button 
          class="btn btn-secondary btn-sm" 
          @click="$emit('borrow', book)"
          :disabled="book.soQuyen <= 0"
        >
          <span v-if="book.soQuyen > 0">Mượn sách</span>
          <span v-else>Hết sách</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});

defineEmits(['borrow']);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
</script>

<style scoped>
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.8rem;
}

.book-author {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.book-publisher {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.book-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #666;
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
  font-size: 0.75rem;
}
</style>