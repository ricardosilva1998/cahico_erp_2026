import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/auth/LoginPage.vue'),
      meta: { requiresAuth: false, guestOnly: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/auth/RegisterPage.vue'),
      meta: { requiresAuth: false, guestOnly: true },
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/main-panel/MainPanel.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/collection/:category',
      name: 'Collection',
      component: () => import('@/collection/CollectionPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: () => import('@/product/ProductDetail.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/profile/ProfilePage.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.initialize()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'Home' }
  }
})

export default router
