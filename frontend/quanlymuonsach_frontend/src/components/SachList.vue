<template>
  <div class="sach-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Danh sách sách</h2>
      <div class="search-box">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control"
          placeholder="Tìm kiếm sách..."
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Bảng hiển thị danh sách sách -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Nhà xuất bản</th>
            <th>Đơn giá</th>
            <th>Số quyển</th>
            <th>Năm XB</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sach in sachList" :key="sach._id">
            <td>{{ sach.maSach }}</td>
            <td>{{ sach.tenSach }}</td>
            <td>{{ sach.maNXB?.tenNXB }}</td>
            <td>{{ formatCurrency(sach.donGia) }}</td>
            <td>{{ sach.soQuyen }}</td>
            <td>{{ sach.namXuatBan }}</td>
            <td>
              <button
                class="btn btn-primary btn-sm me-2"
                @click="editSach(sach)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="deleteSach(sach._id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="d-flex justify-content-between align-items-center mt-4">
      <div>Hiển thị {{ sachList.length }} / {{ totalSach }} sách</div>
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage - 1)"
            >
              Trước
            </a>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" href="#" @click.prevent="changePage(page)">
              {{ page }}
            </a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(currentPage + 1)"
            >
              Sau
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SachList",
  data() {
    return {
      sachList: [],
      currentPage: 1,
      totalPages: 0,
      totalSach: 0,
      searchTerm: "",
      searchTimeout: null,
    };
  },
  created() {
    this.fetchSach();
  },
  methods: {
    async fetchSach() {
      try {
        const response = await axios.get(`http://localhost:3000/api/sach`, {
          params: {
            page: this.currentPage,
            limit: 10,
            tenSach: this.searchTerm,
          },
        });
        this.sachList = response.data.sach;
        this.totalPages = response.data.totalPages;
        this.totalSach = response.data.totalSach;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchSach();
      }, 300);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchSach();
      }
    },
    editSach(sach) {
      this.$emit("edit-sach", sach);
    },
    async deleteSach(id) {
      if (confirm("Bạn có chắc chắn muốn xóa sách này?")) {
        try {
          await axios.delete(`http://localhost:3000/api/sach/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          this.fetchSach();
        } catch (error) {
          console.error("Lỗi khi xóa sách:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.sach-list {
  padding: 20px;
}

.search-box {
  width: 300px;
}

.table th {
  white-space: nowrap;
}

.pagination {
  margin-bottom: 0;
}
</style>
