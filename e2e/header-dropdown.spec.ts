import { test, expect } from '@playwright/test'
import { assertNoHorizontalOverflow, isMobile, mockLogin } from './helpers'

async function openMobileMenuIfNeeded(page: import('@playwright/test').Page) {
  if (isMobile(page)) {
    await page.locator('.mobile-toggle').click()
    await expect(page.locator('.mobile-nav')).toBeVisible()
  }
}

test.describe('Header & Dropdown', () => {
  test('logged out: shows login button or link', async ({ page }) => {
    await page.goto('/')
    await openMobileMenuIfNeeded(page)
    const scope = isMobile(page) ? page.locator('.mobile-nav') : page
    const loginEl = scope.locator('a:has-text("Login"), a:has-text("Sign in"), button:has-text("Login"), button:has-text("Sign in"), .login-btn, .sign-in-btn')
    await expect(loginEl.first()).toBeVisible()
  })

  test('after login: avatar/account section visible', async ({ page }) => {
    await mockLogin(page)
    await page.goto('/')
    await openMobileMenuIfNeeded(page)
    const scope = isMobile(page) ? page.locator('.mobile-nav') : page
    const account = scope.locator('.account-section, .user-avatar, .profile-btn, .account-btn')
    await expect(account.first()).toBeVisible()
  })

  test('after login: dropdown opens on click', async ({ page }) => {
    await mockLogin(page)
    await page.goto('/')
    await openMobileMenuIfNeeded(page)
    const scope = isMobile(page) ? page.locator('.mobile-nav') : page
    const trigger = scope.locator('.account-section, .user-avatar, .profile-btn, .account-btn').first()
    await trigger.click()
    const dropdown = page.locator('.dropdown-card')
    await expect(dropdown).toBeVisible()
  })

  test('cart badge appears after adding item', async ({ page }) => {
    await page.goto('/product/alfama-ring')
    await page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag"), .add-to-cart-btn').click()
    if (isMobile(page)) {
      await page.locator('.mobile-toggle').click()
      await expect(page.locator('.mobile-actions-row .cart-badge')).toBeVisible()
    } else {
      await expect(page.locator('.cart-badge')).toBeVisible()
    }
  })

  test('no horizontal overflow', async ({ page }) => {
    await page.goto('/')
    await assertNoHorizontalOverflow(page)
  })
})
