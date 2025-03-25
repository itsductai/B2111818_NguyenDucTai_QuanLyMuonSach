import { createRouter, createWebHistory } from 'vue-router'
import SachList from '@/components/SachList.vue'
import SachForm from '@/components/SachForm.vue'

const routes = [
  {
    path: '/',
    redirect: '/sach'
  },
  {
    path: '/sach',
    name: 'SachList',
    component: SachList
  },
  {
    path: '/sach/them',
    name: 'ThemSach',
    component: SachForm
  },
  {
    path: '/sach/sua/:id',
    name: 'SuaSach',
    component: SachForm
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 