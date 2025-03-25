<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Quản lý sách</h2>
      <button
        @click="$router.push('/sach/them')"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <i class="fas fa-plus mr-2"></i>
        Thêm sách mới
      </button>
    </div>

    <!-- Thanh tìm kiếm -->
    <div class="mb-6">
      <div class="relative">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="handleSearch"
        />
        <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
      </div>
    </div>

    <!-- Bảng danh sách -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full table-auto">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã sách</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sách</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhà xuất bản</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số quyển</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năm XB</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="sach in sachList" :key="sach._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ sach.maSach }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sach.tenSach }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sach.tacGia }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sach.maNXB?.tenNXB }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(sach.donGia) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sach.soQuyen }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sach.namXuatBan }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div class="flex justify-center space-x-2">
                <button
                  @click="$router.push(`/sach/sua/${sach._id}`)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Sửa"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="confirmDelete(sach)"
                  class="text-red-600 hover:text-red-900"
                  title="Xóa"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="sachList.length === 0">
            <td colspan="8" class="px-6 py-4 text-center text-gray-500">
              Không có dữ liệu
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-700">
        Hiển thị {{ sachList.length }} / {{ totalItems }} kết quả
      </div>
      <div class="flex space-x-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-3 py-1 rounded border"
          :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          class="px-3 py-1 rounded border"
          :class="currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          {{ page }}
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="px-3 py-1 rounded border"
          :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'SachList',
  setup() {
    const sachList = ref([])
    const currentPage = ref(1)
    const totalPages = ref(1)
    const totalItems = ref(0)
    const searchTerm = ref('')
    const searchTimeout = ref(null)

    const fetchSach = async (page = 1) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/sach?page=${page}&limit=10`)
        sachList.value = response.data.sach
        currentPage.value = response.data.currentPage
        totalPages.value = response.data.totalPages
        totalItems.value = response.data.total
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sách:', error)
      }
    }

    const handleSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
      searchTimeout.value = setTimeout(async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/sach/search?q=${searchTerm.value}`)
          sachList.value = response.data
          totalItems.value = response.data.length
          totalPages.value = 1
          currentPage.value = 1
        } catch (error) {
          console.error('Lỗi khi tìm kiếm sách:', error)
        }
      }, 300)
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchSach(page)
      }
    }

    const confirmDelete = async (sach) => {
      if (confirm(`Bạn có chắc chắn muốn xóa sách "${sach.tenSach}"?`)) {
        try {
          await axios.delete(`http://localhost:3000/api/sach/${sach._id}`)
          await fetchSach(currentPage.value)
        } catch (error) {
          console.error('Lỗi khi xóa sách:', error)
        }
      }
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    }

    onMounted(() => {
      fetchSach()
    })

    return {
      sachList,
      currentPage,
      totalPages,
      totalItems,
      searchTerm,
      handleSearch,
      changePage,
      confirmDelete,
      formatCurrency
    }
  }
}
</script> 