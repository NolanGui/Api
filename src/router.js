import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HistoryView from './views/HistoryView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: App 
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryView,
    props: (route) => ({ 
      gameHistory: JSON.parse(localStorage.getItem('hpGameHistory')) || [] 
    })
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router