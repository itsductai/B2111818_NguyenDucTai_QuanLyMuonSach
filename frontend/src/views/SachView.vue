<template>
  <div class="sach-view container-fluid">
    <div class="row">
      <div class="col-12">
        <SachList
          :sachList="sachStore.sachList"
          :currentPage="sachStore.currentPage"
          :totalPages="sachStore.totalPages"
          @add="openModal()"
          @edit="openModal($event)"
          @delete="handleDelete"
          @page-change="handlePageChange"
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
import { useSachStore } from '@/stores/sach'
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
      isModalOpen: false,
      selectedSach: null
    }
  },
  setup() {
    const sachStore = useSachStore()
    return { sachStore }
  },
  async created() {
    await this.sachStore.fetchSachList()
  },
  methods: {
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
          await this.sachStore.updateSach(this.selectedSach._id, formData)
        } else {
          await this.sachStore.createSach(formData)
        }
        this.closeModal()
      } catch (error) {
        console.error('Lỗi khi lưu sách:', error)
      }
    },
    async handleDelete(id) {
      if (confirm('Bạn có chắc chắn muốn xóa sách này?')) {
        try {
          await this.sachStore.deleteSach(id)
        } catch (error) {
          console.error('Lỗi khi xóa sách:', error)
        }
      }
    },
    async handlePageChange(page) {
      await this.sachStore.fetchSachList(page)
    }
  }
}
</script>

<style scoped>
.sach-view {
  padding: 20px;
}
</style> 