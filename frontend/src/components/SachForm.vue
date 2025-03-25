<template>
  <div class="sach-form">
    <h3>{{ isEdit ? "Cập nhật sách" : "Thêm sách mới" }}</h3>
    <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên sách</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.tenSach"
            required
          />
          <div class="invalid-feedback">
            Vui lòng nhập tên sách
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Nhà xuất bản</label>
          <select class="form-select" v-model="formData.maNXB" required>
            <option value="">Chọn nhà xuất bản</option>
            <option
              v-for="nxb in nhaXuatBans"
              :key="nxb._id"
              :value="nxb._id"
            >
              {{ nxb.tenNXB }}
            </option>
          </select>
          <div class="invalid-feedback">
            Vui lòng chọn nhà xuất bản
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Đơn giá</label>
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              v-model.number="formData.donGia"
              min="0"
              required
            />
            <span class="input-group-text">VNĐ</span>
          </div>
          <div class="invalid-feedback">
            Vui lòng nhập đơn giá hợp lệ
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Số quyển</label>
          <input
            type="number"
            class="form-control"
            v-model.number="formData.soQuyen"
            min="0"
            required
          />
          <div class="invalid-feedback">
            Vui lòng nhập số quyển hợp lệ
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Năm xuất bản</label>
          <input
            type="number"
            class="form-control"
            v-model.number="formData.namXuatBan"
            :min="1900"
            :max="new Date().getFullYear()"
            required
          />
          <div class="invalid-feedback">
            Vui lòng nhập năm xuất bản hợp lệ
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tác giả</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.tacGia"
            required
          />
          <div class="invalid-feedback">
            Vui lòng nhập tên tác giả
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          Hủy
        </button>
        <button type="submit" class="btn btn-primary">
          {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { nhaXuatBanService } from '@/services/api.service'

export default {
  name: 'SachForm',
  props: {
    sach: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formData: {
        tenSach: '',
        maNXB: '',
        donGia: 0,
        soQuyen: 0,
        namXuatBan: new Date().getFullYear(),
        tacGia: ''
      },
      nhaXuatBans: []
    }
  },
  computed: {
    isEdit() {
      return !!this.sach
    }
  },
  async created() {
    await this.fetchNhaXuatBans()
    if (this.sach) {
      this.formData = { ...this.sach }
    }
  },
  methods: {
    async fetchNhaXuatBans() {
      try {
        const data = await nhaXuatBanService.getAll()
        this.nhaXuatBans = data
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhà xuất bản:', error)
      }
    },
    handleSubmit() {
      // Validate form
      if (!this.$el.checkValidity()) {
        this.$el.classList.add('was-validated')
        return
      }
      this.$emit('submit', this.formData)
    }
  }
}
</script>

<style scoped>
.sach-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.invalid-feedback {
  font-size: 0.875rem;
}

.btn {
  padding: 0.5rem 1.5rem;
}
</style>
