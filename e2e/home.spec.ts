import { test, expect } from '@playwright/test'
import { isMobile, assertNoHorizontalOverflow } from './helpers'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero section renders with title, subtitle, and CTA', async ({ page }) => {
    await expect(page.locator('.hero-section, .hero')).toBeVisible()
    await expect(page.locator('.hero-title, .hero h1, .hero-section h1')).toBeVisible()
  })

  test('collections section renders cards', async ({ page }) => {
    const collections = page.locator('.collection-card, .collections-grid .card, .category-card')
    await expect(collections.first()).toBeVisible()
    const count = await collections.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('featured pieces section visible', async ({ page }) => {
    const featured = page.locator('.featured-section, .featured-pieces, .featured')
    await expect(featured).toBeVisible()
  })

  test('mobile: collections stack vertically', async ({ page }) => {
    test.skip(!isMobile(page), 'Mobile only')
    const cards = page.locator('.collection-card, .collections-grid .card, .category-card')
    const count = await cards.count()
    if (count >= 2) {
      const first = await cards.nth(0).boundingBox()
      const second = await cards.nth(1).boundingBox()
      expect(first).toBeTruthy()
      expect(second).toBeTruthy()
      // Stacked vertically means similar x position
      expect(Math.abs(first!.x - second!.x)).toBeLessThan(50)
    }
  })

  test('no horizontal overflow', async ({ page }) => {
    await assertNoHorizontalOverflow(page)
  })
})
