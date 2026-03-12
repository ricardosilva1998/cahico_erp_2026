import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { getAllProducts, type Product } from '@/data/products'
import { supabase } from '@/lib/supabase'

export interface CartItem {
  productId: string
  quantity: number
}

export interface EnrichedCartItem extends CartItem {
  product: Product
  lineTotal: number
}

interface StoredCart {
  items: CartItem[]
  cartUpdatedAt: number | null
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const cartUpdatedAt = ref<number | null>(null)
  const authStore = useAuthStore()

  function storageKey(): string {
    const userId = authStore.user?.id ?? 'guest'
    return `cahico_cart_${userId}`
  }

  function loadCart() {
    try {
      const stored = localStorage.getItem(storageKey())
      if (!stored) {
        items.value = []
        cartUpdatedAt.value = null
        return
      }
      const parsed = JSON.parse(stored)
      // Backward-compat: plain array means items-only with no timestamp
      if (Array.isArray(parsed)) {
        items.value = parsed
        cartUpdatedAt.value = null
      } else {
        const data = parsed as StoredCart
        items.value = data.items ?? []
        cartUpdatedAt.value = data.cartUpdatedAt ?? null
      }
    } catch {
      items.value = []
      cartUpdatedAt.value = null
    }
  }

  function saveCart() {
    const data: StoredCart = { items: items.value, cartUpdatedAt: cartUpdatedAt.value }
    localStorage.setItem(storageKey(), JSON.stringify(data))
  }

  async function syncToSupabase() {
    if (!supabase || !authStore.user) return
    try {
      await supabase.from('abandoned_carts').upsert({
        user_id: authStore.user.id,
        email: authStore.user.email ?? '',
        items: JSON.stringify(items.value),
        updated_at: new Date().toISOString(),
        notified: false,
      })
    } catch {
      // Sync failures never break cart UX
    }
  }

  async function deleteFromSupabase() {
    if (!supabase || !authStore.user) return
    try {
      await supabase.from('abandoned_carts').delete().eq('user_id', authStore.user.id)
    } catch {
      // Sync failures never break cart UX
    }
  }

  function addItem(productId: string, quantity = 1) {
    const existing = items.value.find((i) => i.productId === productId)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ productId, quantity })
    }
    cartUpdatedAt.value = Date.now()
    saveCart()
    void syncToSupabase()
  }

  function removeItem(productId: string) {
    items.value = items.value.filter((i) => i.productId !== productId)
    cartUpdatedAt.value = Date.now()
    saveCart()
    void syncToSupabase()
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    const existing = items.value.find((i) => i.productId === productId)
    if (existing) {
      existing.quantity = quantity
      cartUpdatedAt.value = Date.now()
      saveCart()
      void syncToSupabase()
    }
  }

  function clearCart() {
    items.value = []
    cartUpdatedAt.value = null
    saveCart()
    void deleteFromSupabase()
  }

  const cartCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0),
  )

  const cartItems = computed<EnrichedCartItem[]>(() =>
    items.value
      .map((item) => {
        const product = getAllProducts().find((p) => p.id === item.productId)
        if (!product) return null
        return {
          ...item,
          product,
          lineTotal: product.priceEur * item.quantity,
        }
      })
      .filter((x): x is EnrichedCartItem => x !== null),
  )

  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, i) => sum + i.lineTotal, 0),
  )

  // Reload cart when auth state changes
  watch(
    () => authStore.user?.id,
    () => loadCart(),
  )

  // Initial load
  loadCart()

  return {
    items,
    cartUpdatedAt,
    cartCount,
    cartTotal,
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCart,
  }
})
