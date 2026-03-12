import { test, expect } from '@playwright/test'
import { isMobile, assertNoHorizontalOverflow, assertMinTouchTarget } from './helpers'

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/product/alfama-ring')
  })

  test('gallery and product info visible', async ({ page }) => {
    await expect(page.locator('.product-gallery, .gallery, .product-images')).toBeVisible()
    await expect(page.locator('.product-info, .product-details')).toBeVisible()
  })

  test('price and Add to Cart visible', async ({ page }) => {
    await expect(page.locator('.product-price, .price')).toBeVisible()
    await expect(page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag"), .add-to-cart-btn')).toBeVisible()
  })

  test('mobile: touch targets >= 44px', async ({ page }) => {
    test.skip(!isMobile(page), 'Mobile only')
    const addBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag"), .add-to-cart-btn')
    await assertMinTouchTarget(addBtn)
  })

  test('mobile: gallery and info stack vertically', async ({ page }) => {
    test.skip(!isMobile(page), 'Mobile only')
    const gallery = await page.locator('.product-gallery, .gallery, .product-images').boundingBox()
    const info = await page.locator('.product-info, .product-details').boundingBox()
    expect(gallery).toBeTruthy()
    expect(info).toBeTruthy()
    // Info should be below gallery on mobile
    expect(info!.y).toBeGreaterThan(gallery!.y)
  })

  test('no horizontal overflow', async ({ page }) => {
    await assertNoHorizontalOverflow(page)
  })
})
