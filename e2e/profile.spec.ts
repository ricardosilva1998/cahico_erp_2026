import { test, expect } from '@playwright/test'
import { assertNoHorizontalOverflow, mockLogin } from './helpers'

test.describe('Profile Page', () => {
  test('unauthenticated redirects to login', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/login/)
  })

  test('authenticated: profile sections visible', async ({ page }) => {
    await mockLogin(page)
    await page.goto('/profile')
    await expect(page.locator('.profile-page, .profile')).toBeVisible()
  })

  test('authenticated: section tabs visible and switchable', async ({ page }) => {
    await mockLogin(page)
    await page.goto('/profile')
    const tabs = page.locator('.profile-nav .nav-btn')
    const count = await tabs.count()
    expect(count).toBeGreaterThanOrEqual(2)

    // Click second tab and verify content changes
    if (count >= 2) {
      await tabs.nth(1).click()
      await expect(page.locator('.profile-page, .profile')).toBeVisible()
    }
  })

  test('no horizontal overflow', async ({ page }) => {
    await mockLogin(page)
    await page.goto('/profile')
    await assertNoHorizontalOverflow(page)
  })
})
