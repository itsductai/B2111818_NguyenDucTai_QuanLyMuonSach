<template>
  <div class="borrow-form">
    <div class="alert alert-error" v-if="error">{{ error }}</div>
    
    <div class="borrow-book-info">
      <h3>{{ book?.tenSach }}</h3>
      <p><strong>Tác giả:</strong> {{ book?.tacGia }}</p>
      <p><strong>Nhà xuất bản:</strong> {{ book?.maNXB?.tenNXB }}</p>
    </div>
    
    <div class="form-group">
      <label for="ngayMuon">Ngày mượn:</label>
      <input 
        type="date" 
        id="ngayMuon" 
        class="form-control" 
        v-model="formData.ngayMuon" 
        :min="today"
        required
      />
    </div>
    
    <div class="form-group">
      <label for="ngayTra">Ngày trả (dự kiến):</label>
      <input 
        type="date" 
        id="ngayTra" 
        class="form-control" 
        v-model="formData.ngayTra" 
        :min="formData.ngayMuon"
        required
      />
    </div>
    
    <div class="form-actions">
      <button class="btn btn-secondary" @click="$emit('cancel')">Hủy</button>
      <button class="btn btn-primary" @click="submitForm" :disabled="loading">
        <span v-if="loading">Đang xử lý...</span>
        <span v-else>Xác nhận mượn</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit', 'cancel']);

const error = ref('');
const loading = ref(false);

const formData = reactive({
  ngayMuon: new Date().toISOString().split('T')[0],
  ngayTra: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
});

const today = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const submitForm = () => {
  if (!formData.ngayMuon || !formData.ngayTra) {
    error.value = 'Vui lòng chọn ngày mượn và ngày trả.';
    return;
  }
  
  if (new Date(formData.ngayTra) < new Date(formData.ngayMuon)) {
    error.value = 'Ngày trả phải sau ngày mượn.';
    return;
  }
  
  loading.value = true;
  emit('submit', { ...formData });
};

// Reset form khi book thay đổi
watch(() => props.book, () => {
  formData.ngayMuon = new Date().toISOString().split('T')[0];
  formData.ngayTra = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  error.value = '';
});
</script>

<style scoped>
.borrow-form {
  padding: 1rem;
}

.borrow-book-info {
  margin-bottom: 1.5rem;
}

.borrow-book-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
</style>