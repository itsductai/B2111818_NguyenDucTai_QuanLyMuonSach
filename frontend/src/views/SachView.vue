<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Quản Lý Sách</h1>
            <button
                @click="router.push('/sach/them')"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
                <i class="fas fa-plus mr-2"></i>
                Thêm Sách Mới
            </button>
        </div>

        <!-- Thanh tìm kiếm -->
        <div class="mb-6">
            <div class="relative">
                <input
                    type="text"
                    v-model="searchQuery"
                    @input="handleSearch"
                    placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="absolute right-3 top-2.5 text-gray-400">
                    <i class="fas fa-search"></i>
                </span>
            </div>
        </div>

        <!-- Bảng danh sách sách -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã Sách
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên Sách
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tác Giả
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nhà Xuất Bản
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Đơn Giá
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số Quyển
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Năm XB
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao Tác
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="sach in danhSachSach" :key="sach._id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{ sach.maSach }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ sach.tenSach }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ sach.tacGia }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ sach.maNXB?.tenNXB }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ formatCurrency(sach.donGia) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ sach.soQuyen }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ sach.namXuatBan }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                                @click="router.push('/sach/sua/' + sach._id)"
                                class="text-blue-600 hover:text-blue-900 mr-4"
                                title="Sửa sách"
                            >
                                <i class="fas fa-edit"></i>
                            </button>
                            <button
                                @click="confirmDelete(sach)"
                                class="text-red-600 hover:text-red-900"
                                title="Xóa sách"
                            >
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Phân trang -->
        <div class="mt-4 flex justify-between items-center">
            <div class="text-sm text-gray-700">
                Hiển thị {{ (currentPage - 1) * limit + 1 }} đến
                {{ Math.min(currentPage * limit, total) }} trong tổng số {{ total }} sách
            </div>
            <div class="flex space-x-2">
                <button
                    @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                    <i class="fas fa-chevron-left mr-1"></i>
                    Trước
                </button>
                <button
                    @click="changePage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                    Sau
                    <i class="fas fa-chevron-right ml-1"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { sachAPI } from '../services/api.service';

const router = useRouter();
const danhSachSach = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const limit = ref(10);
const searchQuery = ref('');
const isLoading = ref(false);

// Lấy danh sách sách
const fetchDanhSachSach = async () => {
    try {
        isLoading.value = true;
        const response = await sachAPI.getAll(currentPage.value, limit.value);
        danhSachSach.value = response.sach;
        currentPage.value = response.currentPage;
        totalPages.value = response.totalPages;
        total.value = response.total;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sách:', error);
        alert('Có lỗi xảy ra khi tải danh sách sách. Vui lòng thử lại sau.');
    } finally {
        isLoading.value = false;
    }
};

// Xử lý tìm kiếm
const handleSearch = async () => {
    try {
        isLoading.value = true;
        if (searchQuery.value.trim()) {
            const response = await sachAPI.search(searchQuery.value);
            danhSachSach.value = response;
            currentPage.value = 1;
            totalPages.value = 1;
            total.value = response.length;
        } else {
            fetchDanhSachSach();
        }
    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        alert('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
    } finally {
        isLoading.value = false;
    }
};

// Chuyển trang
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchDanhSachSach();
    }
};

// Xác nhận xóa
const confirmDelete = async (sach) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sách "${sach.tenSach}"?`)) {
        try {
            isLoading.value = true;
            await sachAPI.delete(sach._id);
            alert('Xóa sách thành công!');
            fetchDanhSachSach();
        } catch (error) {
            console.error('Lỗi khi xóa sách:', error);
            alert('Có lỗi xảy ra khi xóa sách. Vui lòng thử lại sau.');
        } finally {
            isLoading.value = false;
        }
    }
};

// Định dạng tiền tệ
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};

onMounted(() => {
    fetchDanhSachSach();
});
</script>

<style scoped>
.fas {
    font-size: 1rem;
}
</style> 