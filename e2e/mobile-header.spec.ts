import { test, expect } from '@playwright/test'
import { isMobile, assertNoHorizontalOverflow, assertMinTouchTarget } from './helpers'

test.describe('Mobile Header', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!isMobile(page), 'Mobile only')
    await page.goto('/')
  })

  test('only logo and hamburger visible in header bar', async ({ page }) => {
    await expect(page.locator('.header-inner .logo, .header-inner .logo-link').first()).toBeVisible()
    await expect(page.locator('.mobile-toggle')).toBeVisible()
    await expect(page.locator('.header-actions')).toBeHidden()
    await expect(page.locator('.header-nav')).toBeHidden()
  })

  test('hamburger opens drawer with action buttons', async ({ page }) => {
    await page.locator('.mobile-toggle').click()
    await expect(page.locator('.mobile-nav')).toBeVisible()
    const actionsRow = page.locator('.mobile-actions-row')
    await expect(actionsRow).toBeVisible()
    await expect(actionsRow.locator('.cart-btn')).toBeVisible()
    await expect(actionsRow.locator('.theme-toggle')).toBeVisible()
  })

  test('cart button in mobile menu navigates to cart', async ({ page }) => {
    await page.locator('.mobile-toggle').click()
    await page.locator('.mobile-actions-row .cart-btn').click()
    await expect(page).toHaveURL('/cart')
    await expect(page.locator('.mobile-nav')).toBeHidden()
  })

  test('theme toggle works in mobile menu', async ({ page }) => {
    await page.locator('.mobile-toggle').click()
    const htmlEl = page.locator('html')
    const initialTheme = await htmlEl.getAttribute('data-theme')
    await page.locator('.mobile-actions-row .theme-toggle').click()
    const newTheme = await htmlEl.getAttribute('data-theme')
    expect(newTheme).not.toBe(initialTheme)
  })

  test('menu closes after nav link click', async ({ page }) => {
    await page.locator('.mobile-toggle').click()
    await expect(page.locator('.mobile-nav')).toBeVisible()
    await page.locator('.mobile-nav .mobile-link').first().click()
    await expect(page.locator('.mobile-nav')).toBeHidden()
  })

  test('no horizontal overflow on home page', async ({ page }) => {
    await assertNoHorizontalOverflow(page)
  })

  test('no horizontal overflow on login page', async ({ page }) => {
    await page.goto('/login')
    await assertNoHorizontalOverflow(page)
  })

  test('no horizontal overflow on cart page', async ({ page }) => {
    await page.goto('/cart')
    await assertNoHorizontalOverflow(page)
  })

  test('touch targets are at least 44px', async ({ page }) => {
    await assertMinTouchTarget(page.locator('.mobile-toggle'))
    await page.locator('.mobile-toggle').click()
    const mobileLinks = page.locator('.mobile-nav .mobile-link')
    const count = await mobileLinks.count()
    for (let i = 0; i < count; i++) {
      await assertMinTouchTarget(mobileLinks.nth(i))
    }
  })
})
