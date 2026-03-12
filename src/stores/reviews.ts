import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export interface ProductReview {
  id: string
  productId: string
  userId: string
  userDisplayName: string
  rating: number
  text: string
  createdAt: string
}

const REVIEWS_KEY = 'cahico_reviews'

function getPurchasesKey(userId: string) {
  return `cahico_purchases_${userId}`
}

let nextId = 1
function genId(): string {
  return `rev-${Date.now()}-${nextId++}`
}

const SEED_REVIEWS: ProductReview[] = [
  {
    id: 'seed-1',
    productId: 'alfama-ring',
    userId: 'seed-user-1',
    userDisplayName: 'Maria S.',
    rating: 5,
    text: 'Absolutely stunning ring. The craftsmanship is exquisite and the diamond catches light beautifully. My husband surprised me with this for our anniversary.',
    createdAt: '2026-02-15T10:30:00Z',
  },
  {
    id: 'seed-2',
    productId: 'alfama-ring',
    userId: 'seed-user-2',
    userDisplayName: 'João P.',
    rating: 4,
    text: 'Beautiful design inspired by Lisbon. The gold quality is exceptional. Only reason for 4 stars is the sizing ran slightly small.',
    createdAt: '2026-01-20T14:15:00Z',
  },
  {
    id: 'seed-3',
    productId: 'chiado-necklace',
    userId: 'seed-user-1',
    userDisplayName: 'Maria S.',
    rating: 5,
    text: 'The emerald pendant is breathtaking. You can feel the quality and care that went into making this piece. Highly recommend!',
    createdAt: '2026-03-01T09:00:00Z',
  },
]

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref<ProductReview[]>([])

  function loadReviews() {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY)
      if (stored) {
        reviews.value = JSON.parse(stored)
      } else {
        reviews.value = [...SEED_REVIEWS]
        saveReviews()
      }
    } catch {
      reviews.value = [...SEED_REVIEWS]
      saveReviews()
    }
  }

  function saveReviews() {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews.value))
  }

  function getReviewsForProduct(productId: string): ProductReview[] {
    return reviews.value
      .filter(r => r.productId === productId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  function getAverageRating(productId: string): number {
    const productReviews = reviews.value.filter(r => r.productId === productId)
    if (productReviews.length === 0) return 0
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / productReviews.length) * 10) / 10
  }

  function getReviewCount(productId: string): number {
    return reviews.value.filter(r => r.productId === productId).length
  }

  function getPurchasedProducts(userId: string): string[] {
    try {
      const stored = localStorage.getItem(getPurchasesKey(userId))
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  function hasPurchased(productId: string): boolean {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || !authStore.user) return false
    const purchases = getPurchasedProducts(authStore.user.id)
    return purchases.includes(productId)
  }

  function hasReviewed(productId: string): boolean {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || !authStore.user) return false
    return reviews.value.some(r => r.productId === productId && r.userId === authStore.user!.id)
  }

  function canReview(productId: string): boolean {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return false
    return hasPurchased(productId) && !hasReviewed(productId)
  }

  function addReview(productId: string, rating: number, text: string): boolean {
    const authStore = useAuthStore()
    if (!canReview(productId)) return false

    const review: ProductReview = {
      id: genId(),
      productId,
      userId: authStore.user!.id,
      userDisplayName: authStore.userDisplayName || 'Anonymous',
      rating: Math.max(1, Math.min(5, rating)),
      text,
      createdAt: new Date().toISOString(),
    }
    reviews.value.push(review)
    saveReviews()
    return true
  }

  function addPurchase(productId: string) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated || !authStore.user) return
    const key = getPurchasesKey(authStore.user.id)
    const purchases = getPurchasedProducts(authStore.user.id)
    if (!purchases.includes(productId)) {
      purchases.push(productId)
      localStorage.setItem(key, JSON.stringify(purchases))
    }
  }

  loadReviews()

  return {
    reviews,
    getReviewsForProduct,
    getAverageRating,
    getReviewCount,
    hasPurchased,
    hasReviewed,
    canReview,
    addReview,
    addPurchase,
  }
})
