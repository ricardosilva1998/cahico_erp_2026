import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url and loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.app-container')).toBeVisible()
})
