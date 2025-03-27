<template>
  <form @submit.prevent="handleSubmit" class="borrow-form">
    <div class="form-group">
      <label for="maDocGia">Độc giả</label>
      <select 
        id="maDocGia" 
        v-model="formData.maDocGia" 
        class="form-control"
        required
      >
        <option value="">Chọn độc giả</option>
        <option v-for="reader in readers" :key="reader._id" :value="reader._id">
          {{ reader.hoTenDG }} - {{ reader.email }}
        </option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="maSach">Sách</label>
      <select 
        id="maSach" 
        v-model="formData.maSach" 
        class="form-control"
        required
      >
        <option value="">Chọn sách</option>
        <option 
          v-for="book in availableBooks" 
          :key="book._id" 
          :value="book._id"
          :disabled="book.soQuyen <= 0"
        >
          {{ book.tenSach }} - {{ book.tacGia }} (Còn {{ book.soQuyen }} quyển)
        </option>
      </select>
      <small v-if="selectedBook && selectedBook.soQuyen <= 0" class="text-danger">
        Sách này hiện không có sẵn để mượn
      </small>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label for="ngayMuon">Ngày mượn</label>
        <input 
          type="date" 
          id="ngayMuon" 
          v-model="formData.ngayMuon" 
          class="form-control"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="ngayHenTra">Ngày hẹn trả</label>
        <input 
          type="date" 
          id="ngayHenTra" 
          v-model="formData.ngayHenTra" 
          class="form-control"
          required
          :min="formData.ngayMuon"
        />
        <small v-if="isReturnDateValid" class="text-success">
          Thời gian mượn: {{ borrowDuration }} ngày
        </small>
        <small v-else class="text-danger">
          Ngày hẹn trả phải sau ngày mượn
        </small>
      </div>
    </div>
    
    <div class="form-group">
      <label for="ghiChu">Ghi chú</label>
      <textarea 
        id="ghiChu" 
        v-model="formData.ghiChu" 
        class="form-control"
        rows="3"
      ></textarea>
    </div>
    
    <div class="form-actions">
      <button type="button" @click="$emit('cancel')" class="btn btn-secondary">
        Hủy
      </button>
      <button 
        type="submit" 
        class="btn btn-primary"
        :disabled="!isFormValid || isSubmitting"
      >
        {{ isSubmitting ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Tạo phiếu mượn') }}
      </button>
    </div>
  </form>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue';

export default {
  props: {
    borrow: {
      type: Object,
      default: null
    },
    readers: {
      type: Array,
      default: () => []
    },
    books: {
      type: Array,
      default: () => []
    }
  },
  
  emits: ['submit', 'cancel'],
  
  setup(props, { emit }) {
    const isSubmitting = ref(false);
    
    // Form data
    const formData = reactive({
      maDocGia: '',
      maSach: '',
      ngayMuon: new Date().toISOString().split('T')[0],
      ngayHenTra: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ghiChu: ''
    });
    
    // Computed
    const isEditing = computed(() => !!props.borrow);
    
    const availableBooks = computed(() => {
      return props.books.map(book => {
        // Nếu đang chỉnh sửa và sách này đang được mượn, thì vẫn hiển thị
        if (isEditing.value && props.borrow.maSach === book._id) {
          return { ...book, available: true };
        }
        return book;
      });
    });
    
    const selectedBook = computed(() => {
      if (!formData.maSach) return null;
      return props.books.find(book => book._id === formData.maSach);
    });
    
    const isReturnDateValid = computed(() => {
      if (!formData.ngayMuon || !formData.ngayHenTra) return true;
      return new Date(formData.ngayHenTra) >= new Date(formData.ngayMuon);
    });
    
    const borrowDuration = computed(() => {
      if (!formData.ngayMuon || !formData.ngayHenTra || !isReturnDateValid.value) return 0;
      
      const borrowDate = new Date(formData.ngayMuon);
      const returnDate = new Date(formData.ngayHenTra);
      
      const diffTime = Math.abs(returnDate - borrowDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    });
    
    const isFormValid = computed(() => {
      return (
        formData.maDocGia &&
        formData.maSach &&
        formData.ngayMuon &&
        formData.ngayHenTra &&
        isReturnDateValid.value &&
        (selectedBook.value?.soQuyen > 0 || (isEditing.value && props.borrow.maSach === formData.maSach))
      );
    });
    
    // Methods
    function handleSubmit() {
      if (!isFormValid.value) return;
      
      isSubmitting.value = true;
      
      // Emit submit event with form data
      emit('submit', { ...formData });
      
      // Reset submission state after a delay
      setTimeout(() => {
        isSubmitting.value = false;
      }, 1000);
    }
    
    // Watch for changes in props.borrow
    watch(() => props.borrow, (newBorrow) => {
      if (newBorrow) {
        // Fill form with borrow data
        Object.assign(formData, {
          maDocGia: newBorrow.maDocGia || '',
          maSach: newBorrow.maSach || '',
          ngayMuon: newBorrow.ngayMuon ? new Date(newBorrow.ngayMuon).toISOString().split('T')[0] : '',
          ngayHenTra: newBorrow.ngayHenTra ? new Date(newBorrow.ngayHenTra).toISOString().split('T')[0] : '',
          ghiChu: newBorrow.ghiChu || ''
        });
      }
    }, { immediate: true });
    
    return {
      formData,
      isEditing,
      isSubmitting,
      availableBooks,
      selectedBook,
      isReturnDateValid,
      borrowDuration,
      isFormValid,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.borrow-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  font-weight: 500;
}

.form-control {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

select.form-control {
  height: 38px;
}

textarea.form-control {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-secondary {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.text-danger {
  color: #e74c3c;
  font-size: 0.875rem;
}

.text-success {
  color: #27ae60;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
}
</style>