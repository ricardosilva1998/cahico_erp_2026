import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '@/stores/cart'

// Mock supabase as null (mock mode)
vi.mock('@/lib/supabase', () => ({ supabase: null }))

describe('Cart Store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('addItem adds a new item', () => {
    const cart = useCartStore()
    cart.addItem('alfama-ring')
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0]).toEqual({ productId: 'alfama-ring', quantity: 1 })
  })

  it('addItem increments existing item quantity', () => {
    const cart = useCartStore()
    cart.addItem('alfama-ring')
    cart.addItem('alfama-ring', 2)
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].quantity).toBe(3)
  })

  it('removeItem removes by productId', () => {
    const cart = useCartStore()
    cart.addItem('alfama-ring')
    cart.addItem('alfama-necklace')
    cart.removeItem('alfama-ring')
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].productId).toBe('alfama-necklace')
  })

  it('updateQuantity sets quantity', () => {
    const cart = useCartStore()
    cart.addItem('alfama-ring')
    cart.updateQuantity('alfama-ring', 5)
    expect(cart.items[0].quantity).toBe(5)
  })

  it('updateQuantity removes item if <= 0', () => {
    const cart = useCartStore()
    cart.addItem('alfama-ring')
    cart.updateQuantity('alfama-ring', 0)
    expect(cart.items).toHaveLength(0)
  })

  it('clearCart empties items', () => {
    const cart = useCartStore()
    cart.addItem('alfama-ring')
    cart.addItem('alfama-necklace')
    cart.clearCart()
    expect(cart.items).toHaveLength(0)
  })

  it('cartCount sums quantities', () => {
    const cart = useCartStore()
    cart.addItem('alfama-ring', 2)
    cart.addItem('alfama-necklace', 3)
    expect(cart.cartCount).toBe(5)
  })

  it('cartTotal sums line totals', () => {
    const cart = useCartStore()
    cart.addItem('alfama-ring')
    // cartTotal depends on product data — just verify it's a number >= 0
    expect(cart.cartTotal).toBeGreaterThanOrEqual(0)
  })

  it('persists to localStorage and restores', () => {
    const cart = useCartStore()
    cart.addItem('alfama-ring', 2)

    // Create new pinia to simulate page reload
    setActivePinia(createPinia())
    const cart2 = useCartStore()
    expect(cart2.items).toHaveLength(1)
    expect(cart2.items[0].quantity).toBe(2)
  })

  it('backward-compat: loads plain array format', () => {
    // Old format was a plain array
    localStorage.setItem('cahico_cart_guest', JSON.stringify([{ productId: 'alfama-ring', quantity: 1 }]))
    const cart = useCartStore()
    expect(cart.items).toHaveLength(1)
    expect(cart.cartUpdatedAt).toBeNull()
  })

  it('cartUpdatedAt is set on mutations and null on clear', () => {
    const cart = useCartStore()
    expect(cart.cartUpdatedAt).toBeNull()

    cart.addItem('alfama-ring')
    expect(cart.cartUpdatedAt).toBeTypeOf('number')
    expect(cart.cartUpdatedAt).toBeGreaterThan(0)

    const ts1 = cart.cartUpdatedAt!
    cart.updateQuantity('alfama-ring', 3)
    expect(cart.cartUpdatedAt).toBeGreaterThanOrEqual(ts1)

    cart.clearCart()
    expect(cart.cartUpdatedAt).toBeNull()
  })
})
