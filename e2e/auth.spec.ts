import { test, expect } from '@playwright/test'
import { assertNoHorizontalOverflow } from './helpers'

test.describe('Auth Pages', () => {
  test('login page renders form fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('register page renders form fields', async ({ page }) => {
    await page.goto('/register')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('mock login works and redirects to home', async ({ page }) => {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill('test@cahico.com')
    await page.locator('input[type="password"]').fill('password123')
    await page.locator('button[type="submit"]').click()
    await expect(page).toHaveURL('/')
  })

  test('login: no horizontal overflow', async ({ page }) => {
    await page.goto('/login')
    await assertNoHorizontalOverflow(page)
  })

  test('register: no horizontal overflow', async ({ page }) => {
    await page.goto('/register')
    await assertNoHorizontalOverflow(page)
  })
})
