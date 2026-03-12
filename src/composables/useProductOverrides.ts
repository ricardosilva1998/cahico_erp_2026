import { computed } from 'vue'
import { getAllProducts, type Product } from '@/data/products'
import { useAdminStore } from '@/stores/admin'

export interface ProductWithOverrides extends Product {
  hasOverride: boolean
  originalPrice?: number
  originalStock?: number
  effectivePrice: number
  effectiveStock: number
}

export function useProductOverrides() {
  const adminStore = useAdminStore()

  function getProductWithOverrides(product: Product): ProductWithOverrides {
    const override = adminStore.getProductOverride(product.id)
    const effectivePrice = adminStore.getEffectivePrice(product.id, product.priceEur)
    const effectiveStock = adminStore.getEffectiveStock(product.id, product.stock)
    const hasOverride = !!override

    return {
      ...product,
      hasOverride,
      originalPrice: hasOverride && override.priceEur !== undefined ? product.priceEur : undefined,
      originalStock: hasOverride && override.stock !== undefined ? product.stock : undefined,
      effectivePrice,
      effectiveStock,
    }
  }

  const allProductsWithOverrides = computed(() => {
    return getAllProducts().map(getProductWithOverrides)
  })

  return {
    getProductWithOverrides,
    allProductsWithOverrides,
  }
}
