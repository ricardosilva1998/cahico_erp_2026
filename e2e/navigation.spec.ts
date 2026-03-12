import { test, expect } from '@playwright/test'
import { isMobile, assertNoHorizontalOverflow } from './helpers'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('desktop: header nav visible, mobile toggle hidden', async ({ page }) => {
    test.skip(isMobile(page), 'Desktop only')
    await expect(page.locator('.header-nav.desktop-only')).toBeVisible()
    await expect(page.locator('.mobile-toggle')).toBeHidden()
  })

  test('mobile: desktop nav hidden, hamburger visible', async ({ page }) => {
    test.skip(!isMobile(page), 'Mobile only')
    await expect(page.locator('.header-nav.desktop-only')).toBeHidden()
    await expect(page.locator('.mobile-toggle')).toBeVisible()
  })

  test('mobile: hamburger opens mobile menu and links work', async ({ page }) => {
    test.skip(!isMobile(page), 'Mobile only')
    await page.locator('.mobile-toggle').click()
    await expect(page.locator('.mobile-nav')).toBeVisible()
    const links = page.locator('.mobile-nav .mobile-link')
    await expect(links.first()).toBeVisible()
    await links.first().click()
    await expect(page.locator('.mobile-nav')).toBeHidden()
  })

  test('logo navigates to home', async ({ page }) => {
    await page.goto('/login')
    await page.locator('.site-header .logo-link, .site-header .logo').first().click()
    await expect(page).toHaveURL('/')
  })

  test('no horizontal overflow', async ({ page }) => {
    await assertNoHorizontalOverflow(page)
  })
})
