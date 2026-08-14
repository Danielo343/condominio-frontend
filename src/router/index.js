import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ResidentesView from '@/views/ResidentesView.vue'
import FacturacionView from '@/views/FacturacionView.vue'
import ChatView from '@/views/ChatView.vue'
import DocumentosView from '@/views/DocumentosView.vue'
import ConfiguracionView from '@/views/ConfiguracionView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/residentes',
    name: 'residentes',
    component: ResidentesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/facturacion',
    name: 'facturacion',
    component: FacturacionView,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  {
    path: '/documentos',
    name: 'documentos',
    component: DocumentosView,
    meta: { requiresAuth: true }
  },
  {
    path: '/configuracion',
    name: 'configuracion',
    component: ConfiguracionView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
})

export default router