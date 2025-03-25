<template>
  <div class="sach-form">
    <h3>{{ isEdit ? "Cập nhật sách" : "Thêm sách mới" }}</h3>
    <form @submit.prevent="handleSubmit" class="mt-4">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Mã sách</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.maSach"
            required
          />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Tên sách</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.tenSach"
            required
          />
        </div>
      </div>

      <div class="row">
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
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Đơn giá</label>
          <input
            type="number"
            class="form-control"
            v-model.number="formData.donGia"
            min="0"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Số quyển</label>
          <input
            type="number"
            class="form-control"
            v-model.number="formData.soQuyen"
            min="0"
            required
          />
        </div>
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
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Nguồn gốc</label>
        <select class="form-select" v-model="formData.nguonGoc" required>
          <option value="">Chọn nguồn gốc</option>
          <option value="Mua">Mua</option>
          <option value="Tặng">Tặng</option>
          <option value="Tác giả">Tác giả</option>
        </select>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button
          type="button"
          class="btn btn-secondary"
          @click="$emit('cancel')"
        >
          Hủy
        </button>
        <button type="submit" class="btn btn-primary">
          {{ isEdit ? "Cập nhật" : "Thêm mới" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { nhaXuatBanAPI } from '@/services/api'

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
        maSach: '',
        tenSach: '',
        maNXB: '',
        donGia: 0,
        soQuyen: 0,
        namXuatBan: new Date().getFullYear(),
        nguonGoc: ''
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
        const response = await nhaXuatBanAPI.getAll()
        this.nhaXuatBans = response.data
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhà xuất bản:', error)
      }
    },
    handleSubmit() {
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
}
</style>
