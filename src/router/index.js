import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiereAnonimo: true }
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiereAutenticacion: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiereAutenticacion && !authStore.estaAutenticado) {
    next({ name: 'login' })
  } else if (to.meta.requiereAnonimo && authStore.estaAutenticado) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router