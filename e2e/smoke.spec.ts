import { test, expect } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.app-container')).toBeVisible()
    await expect(page.locator('.site-header')).toBeVisible()
  })

  test('login page loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('cart page loads', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.locator('.cart-page, .cart')).toBeVisible()
  })

  test('navigation works from home', async ({ page }) => {
    await page.goto('/')
    const collectionLink = page.locator('a[href*="collection"], .collection-card, .category-card').first()
    if (await collectionLink.isVisible()) {
      await collectionLink.click()
      await expect(page.locator('.app-container')).toBeVisible()
    }
  })
})
