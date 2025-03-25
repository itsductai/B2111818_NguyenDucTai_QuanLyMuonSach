<template>
  <div class="sach-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">Danh sách sách</h2>
        <p class="text-muted mb-0">Tổng số: {{ sachList.length }} sách</p>
      </div>
      <div class="d-flex gap-3 align-items-center">
        <div class="search-box">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Tìm kiếm sách..."
              v-model="searchTerm"
              @input="$emit('search', searchTerm)"
            />
            <span class="input-group-text">
              <i class="fas fa-search"></i>
            </span>
          </div>
        </div>
        <button class="btn btn-primary" @click="$emit('add')">
          <i class="fas fa-plus me-2"></i>Thêm sách mới
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Nhà xuất bản</th>
            <th class="text-end">Đơn giá</th>
            <th class="text-center">Số quyển</th>
            <th class="text-center">Năm XB</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sachList.length === 0">
            <td colspan="7" class="text-center py-4">
              <p class="text-muted mb-0">Chưa có sách nào trong thư viện</p>
            </td>
          </tr>
          <tr v-for="sach in sachList" :key="sach._id">
            <td>{{ sach.tenSach }}</td>
            <td>{{ sach.tacGia }}</td>
            <td>{{ sach.nhaXuatBan?.tenNXB }}</td>
            <td class="text-end">{{ formatCurrency(sach.donGia) }}</td>
            <td class="text-center">{{ sach.soQuyen }}</td>
            <td class="text-center">{{ sach.namXuatBan }}</td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-outline-warning me-2"
                @click="$emit('edit', sach)"
                title="Sửa"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="handleDelete(sach._id)"
                title="Xóa"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-4">
      <div class="text-muted">
        Trang {{ currentPage }} / {{ totalPages }}
      </div>
      <ul class="pagination mb-0">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="$emit('page-change', currentPage - 1)">
            <i class="fas fa-chevron-left"></i>
          </a>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="$emit('page-change', page)">
            {{ page }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="$emit('page-change', currentPage + 1)">
            <i class="fas fa-chevron-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'SachList',
  props: {
    sachList: {
      type: Array,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      searchTerm: ''
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    },
    handleDelete(id) {
      if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
        this.$emit('delete', id)
      }
    }
  }
}
</script>

<style scoped>
.sach-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.search-box {
  width: 300px;
}

.table th {
  font-weight: 600;
}

.table td {
  vertical-align: middle;
}

.btn-sm {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pagination {
  margin-bottom: 0;
}

.page-link {
  padding: 0.5rem 0.75rem;
  min-width: 36px;
  text-align: center;
}
</style>
