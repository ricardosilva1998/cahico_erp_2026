import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

export function isMobile(page: Page): boolean {
  const viewport = page.viewportSize()
  return !!viewport && viewport.width < 768
}

export async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth <= document.documentElement.clientWidth
  })
  expect(overflow).toBe(true)
}

export async function assertMinTouchTarget(locator: Locator, minSize = 44) {
  const box = await locator.boundingBox()
  expect(box).toBeTruthy()
  expect(box!.width).toBeGreaterThanOrEqual(minSize)
  expect(box!.height).toBeGreaterThanOrEqual(minSize)
}

export async function mockLogin(page: Page) {
  await page.goto('/login')
  await page.locator('input[type="email"]').fill('test@cahico.com')
  await page.locator('input[type="password"]').fill('password123')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL('/')
}
