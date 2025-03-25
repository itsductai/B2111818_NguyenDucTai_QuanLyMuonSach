import { defineStore } from 'pinia'
import { sachAPI } from '@/services/api'

export const useSachStore = defineStore('sach', {
  state: () => ({
    sachList: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null
  }),

  actions: {
    async fetchSachList(page = 1) {
      try {
        this.loading = true
        const response = await sachAPI.getAll(page)
        this.sachList = response.data.sach
        this.currentPage = response.data.currentPage
        this.totalPages = response.data.totalPages
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createSach(sachData) {
      try {
        this.loading = true
        await sachAPI.create(sachData)
        await this.fetchSachList(this.currentPage)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSach(id, sachData) {
      try {
        this.loading = true
        await sachAPI.update(id, sachData)
        await this.fetchSachList(this.currentPage)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteSach(id) {
      try {
        this.loading = true
        await sachAPI.delete(id)
        await this.fetchSachList(this.currentPage)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getMostBorrowed() {
      try {
        this.loading = true
        const response = await sachAPI.getMostBorrowed()
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 