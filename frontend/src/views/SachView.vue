<template>
  <div class="sach-view container-fluid">
    <div class="row">
      <div class="col-12">
        <SachList
          :sachList="sachList"
          :currentPage="currentPage"
          :totalPages="totalPages"
          @add="openModal()"
          @edit="openModal($event)"
          @delete="handleDelete"
          @page-change="handlePageChange"
          @search="handleSearch"
        />

        <SachModal
          :isOpen="isModalOpen"
          :sach="selectedSach"
          @close="closeModal"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { sachService } from '@/services/api.service'
import SachList from '@/components/SachList.vue'
import SachModal from '@/components/SachModal.vue'

export default {
  name: 'SachView',
  components: {
    SachList,
    SachModal
  },
  data() {
    return {
      sachList: [],
      currentPage: 1,
      totalPages: 1,
      isModalOpen: false,
      selectedSach: null,
      searchTerm: ''
    }
  },
  async created() {
    await this.fetchSachList()
  },
  methods: {
    async fetchSachList() {
      try {
        const data = await sachService.getAll(this.currentPage)
        this.sachList = data.sach
        this.totalPages = data.totalPages
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sách:', error)
      }
    },
    openModal(sach = null) {
      this.selectedSach = sach
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
      this.selectedSach = null
    },
    async handleSubmit(formData) {
      try {
        if (this.selectedSach) {
          await sachService.update(this.selectedSach._id, formData)
        } else {
          await sachService.create(formData)
        }
        await this.fetchSachList()
        this.closeModal()
      } catch (error) {
        console.error('Lỗi khi lưu sách:', error)
      }
    },
    async handleDelete(id) {
      try {
        await sachService.delete(id)
        await this.fetchSachList()
      } catch (error) {
        console.error('Lỗi khi xóa sách:', error)
      }
    },
    async handlePageChange(page) {
      this.currentPage = page
      await this.fetchSachList()
    },
    async handleSearch(term) {
      this.searchTerm = term
      this.currentPage = 1
      await this.fetchSachList()
    }
  }
}
</script>

<style scoped>
.sach-view {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 56px);
}
</style> 