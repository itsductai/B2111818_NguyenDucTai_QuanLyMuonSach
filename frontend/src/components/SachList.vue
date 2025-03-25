<template>
  <div class="sach-list">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Danh sách sách</h2>
      <button class="btn btn-primary" @click="$emit('add')">
        Thêm sách mới
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Nhà xuất bản</th>
            <th>Đơn giá</th>
            <th>Số quyển</th>
            <th>Năm xuất bản</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sach in sachList" :key="sach._id">
            <td>{{ sach.maSach }}</td>
            <td>{{ sach.tenSach }}</td>
            <td>{{ sach.nhaXuatBan?.tenNXB }}</td>
            <td>{{ formatCurrency(sach.donGia) }}</td>
            <td>{{ sach.soQuyen }}</td>
            <td>{{ sach.namXuatBan }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="$emit('edit', sach)">
                Sửa
              </button>
              <button class="btn btn-sm btn-danger" @click="$emit('delete', sach._id)">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="$emit('page-change', currentPage - 1)">
            Trước
          </a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page"
            :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="$emit('page-change', page)">
            {{ page }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="$emit('page-change', currentPage + 1)">
            Sau
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
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value)
    }
  }
}
</script>

<style scoped>
.sach-list {
  padding: 20px;
}
</style>
