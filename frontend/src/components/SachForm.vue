<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          {{ isEditing ? 'Cập nhật sách' : 'Thêm sách mới' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Tên sách -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tên sách <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.tenSach"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.tenSach }"
            />
            <p v-if="errors.tenSach" class="mt-1 text-sm text-red-500">
              {{ errors.tenSach }}
            </p>
          </div>

          <!-- Tác giả -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tác giả <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.tacGia"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.tacGia }"
            />
            <p v-if="errors.tacGia" class="mt-1 text-sm text-red-500">
              {{ errors.tacGia }}
            </p>
          </div>

          <!-- Nhà xuất bản -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nhà xuất bản <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.maNXB"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.maNXB }"
            >
              <option value="">Chọn nhà xuất bản</option>
              <option v-for="nxb in nhaXuatBans" :key="nxb._id" :value="nxb._id">
                {{ nxb.tenNXB }}
              </option>
            </select>
            <p v-if="errors.maNXB" class="mt-1 text-sm text-red-500">
              {{ errors.maNXB }}
            </p>
          </div>

          <!-- Đơn giá -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Đơn giá <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.donGia"
              type="number"
              min="0"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.donGia }"
            />
            <p v-if="errors.donGia" class="mt-1 text-sm text-red-500">
              {{ errors.donGia }}
            </p>
          </div>

          <!-- Số quyển -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Số quyển <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.soQuyen"
              type="number"
              min="0"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.soQuyen }"
            />
            <p v-if="errors.soQuyen" class="mt-1 text-sm text-red-500">
              {{ errors.soQuyen }}
            </p>
          </div>

          <!-- Năm xuất bản -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Năm xuất bản <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="formData.namXuatBan"
              type="number"
              :min="1900"
              :max="new Date().getFullYear()"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.namXuatBan }"
            />
            <p v-if="errors.namXuatBan" class="mt-1 text-sm text-red-500">
              {{ errors.namXuatBan }}
            </p>
          </div>

          <!-- Nút submit -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="$router.push('/sach')"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              :disabled="isSubmitting"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'SachForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const isEditing = ref(false)
    const isSubmitting = ref(false)
    const nhaXuatBans = ref([])

    const formData = ref({
      tenSach: '',
      tacGia: '',
      maNXB: '',
      donGia: 0,
      soQuyen: 0,
      namXuatBan: new Date().getFullYear()
    })

    const errors = ref({})

    const validateForm = () => {
      const newErrors = {}

      if (!formData.value.tenSach.trim()) {
        newErrors.tenSach = 'Vui lòng nhập tên sách'
      }

      if (!formData.value.tacGia.trim()) {
        newErrors.tacGia = 'Vui lòng nhập tên tác giả'
      }

      if (!formData.value.maNXB) {
        newErrors.maNXB = 'Vui lòng chọn nhà xuất bản'
      }

      if (formData.value.donGia < 0) {
        newErrors.donGia = 'Đơn giá không được âm'
      }

      if (formData.value.soQuyen < 0) {
        newErrors.soQuyen = 'Số quyển không được âm'
      }

      const currentYear = new Date().getFullYear()
      if (formData.value.namXuatBan < 1900 || formData.value.namXuatBan > currentYear) {
        newErrors.namXuatBan = `Năm xuất bản phải từ 1900 đến ${currentYear}`
      }

      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    const fetchNhaXuatBan = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/nhaxuatban')
        nhaXuatBans.value = response.data
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhà xuất bản:', error)
      }
    }

    const fetchSach = async (id) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/sach/${id}`)
        formData.value = response.data
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sách:', error)
        router.push('/sach')
      }
    }

    const handleSubmit = async () => {
      if (!validateForm()) {
        return;
      }

      try {
        isSubmitting.value = true;
        const sachData = { ...formData.value };
        emit('submit', sachData);
      } catch (error) {
        console.error('Lỗi khi submit form:', error);
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(async () => {
      await fetchNhaXuatBan()
      if (route.params.id) {
        isEditing.value = true
        await fetchSach(route.params.id)
      }
    })

    return {
      formData,
      errors,
      isEditing,
      isSubmitting,
      nhaXuatBans,
      handleSubmit
    }
  }
}
</script> 