<template>
  <div class="modal fade" :class="{ show: isOpen }" v-if="isOpen">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <SachForm
            :sach="sach"
            @submit="handleSubmit"
            @cancel="close"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade" :class="{ show: isOpen }" v-if="isOpen"></div>
</template>

<script>
import SachForm from './SachForm.vue'

export default {
  name: 'SachModal',
  components: {
    SachForm
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    sach: {
      type: Object,
      default: null
    }
  },
  computed: {
    title() {
      return this.sach ? 'Cập nhật sách' : 'Thêm sách mới'
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleSubmit(formData) {
      this.$emit('submit', formData)
    }
  }
}
</script>

<style scoped>
.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal.show {
  display: block;
}

.modal-backdrop.show {
  opacity: 0.5;
}
</style>
