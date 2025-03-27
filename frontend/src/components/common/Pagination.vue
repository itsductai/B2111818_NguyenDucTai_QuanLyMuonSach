<template>
  <div class="pagination-container" v-if="totalPages > 1">
    <ul class="pagination">
      <li>
        <button 
          @click="changePage(1)" 
          :disabled="currentPage === 1"
          :class="{ disabled: currentPage === 1 }"
        >
          <i class="fas fa-angle-double-left"></i>
        </button>
      </li>
      <li>
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          :class="{ disabled: currentPage === 1 }"
        >
          <i class="fas fa-angle-left"></i>
        </button>
      </li>
      
      <li v-for="page in displayedPages" :key="page">
        <button 
          @click="changePage(page)" 
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
      </li>
      
      <li>
        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          :class="{ disabled: currentPage === totalPages }"
        >
          <i class="fas fa-angle-right"></i>
        </button>
      </li>
      <li>
        <button 
          @click="changePage(totalPages)" 
          :disabled="currentPage === totalPages"
          :class="{ disabled: currentPage === totalPages }"
        >
          <i class="fas fa-angle-double-right"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisibleButtons: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['page-change']);

const displayedPages = computed(() => {
  if (props.totalPages <= props.maxVisibleButtons) {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1);
  }
  
  const halfButtons = Math.floor(props.maxVisibleButtons / 2);
  let startPage = Math.max(props.currentPage - halfButtons, 1);
  let endPage = Math.min(startPage + props.maxVisibleButtons - 1, props.totalPages);
  
  if (endPage - startPage + 1 < props.maxVisibleButtons) {
    startPage = Math.max(endPage - props.maxVisibleButtons + 1, 1);
  }
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

const changePage = (page) => {
  if (page === props.currentPage) return;
  if (page < 1 || page > props.totalPages) return;
  
  emit('page-change', page);
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
}

.pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination li {
  margin: 0 2px;
}

.pagination button {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid var(--border-color);
  background-color: white;
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination button:hover:not(.disabled):not(.active) {
  background-color: rgba(94, 35, 144, 0.1);
  border-color: var(--primary-color);
}

.pagination button.active {
  background: var(--primary-gradient);
  color: white;
  border: none;
}

.pagination button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>