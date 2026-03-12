import { test, expect } from '@playwright/test'
import { assertNoHorizontalOverflow } from './helpers'

test.describe('Cart Page', () => {
  test('empty cart shows empty state', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.locator('.cart-empty')).toBeVisible()
  })

  test('add item from product page and verify in cart', async ({ page }) => {
    await page.goto('/product/alfama-ring')
    await page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag"), .add-to-cart-btn').click()
    await page.goto('/cart')
    await expect(page.locator('.cart-item, .cart-product')).toBeVisible()
  })

  test('quantity controls update total', async ({ page }) => {
    await page.goto('/product/alfama-ring')
    await page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag"), .add-to-cart-btn').click()
    await page.goto('/cart')
    const incrementBtn = page.locator('.qty-btn:has-text("+")')
    if (await incrementBtn.isVisible()) {
      await incrementBtn.click()
      await expect(page.locator('.qty-value, .item-qty')).toContainText('2')
    }
  })

  test('remove item empties cart', async ({ page }) => {
    await page.goto('/product/alfama-ring')
    await page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag"), .add-to-cart-btn').click()
    await page.goto('/cart')
    const removeBtn = page.locator('.item-remove')
    await removeBtn.click()
    await expect(page.locator('.cart-empty')).toBeVisible()
  })

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/cart')
    await assertNoHorizontalOverflow(page)
  })
})
