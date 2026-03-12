import { test, expect } from '@playwright/test'
import { isMobile, assertNoHorizontalOverflow, mockLogin } from './helpers'

test.describe('Checkout Page', () => {
  test('unauthenticated redirects to login', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page).toHaveURL(/\/login/)
  })

  test('authenticated with item: form visible', async ({ page }) => {
    await mockLogin(page)
    await page.goto('/product/alfama-ring')
    await page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag"), .add-to-cart-btn').click()
    await page.goto('/checkout')
    await expect(page.locator('.checkout-page, .checkout')).toBeVisible()
  })

  test('mobile: single column layout', async ({ page }) => {
    test.skip(!isMobile(page), 'Mobile only')
    await mockLogin(page)
    await page.goto('/product/alfama-ring')
    await page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag"), .add-to-cart-btn').click()
    await page.goto('/checkout')
    // On mobile the checkout sections should stack (similar x)
    const sections = page.locator('.checkout-form, .checkout-summary, .order-summary')
    const count = await sections.count()
    if (count >= 2) {
      const first = await sections.nth(0).boundingBox()
      const second = await sections.nth(1).boundingBox()
      if (first && second) {
        expect(Math.abs(first.x - second.x)).toBeLessThan(50)
      }
    }
  })

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/checkout')
    await assertNoHorizontalOverflow(page)
  })
})
