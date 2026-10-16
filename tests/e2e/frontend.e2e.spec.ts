import { test, expect } from '@playwright/test'

test('home page shows AYO branding and working navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Auckland Youth Orchestra/)
  await expect(page.getByRole('img', { name: 'AYO Logo', exact: true }).first()).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.getByRole('link', { name: 'CONTACT US', exact: true }).first().click()
  await expect(page).toHaveURL(/\/contact-us$/)
  await expect(page.getByRole('heading', { name: 'Contact Us', exact: true })).toBeVisible()
})

test('contact page offers direct email contact', async ({ page }) => {
  await page.goto('/contact-us')
  await expect(page.getByRole('link', { name: 'ayo@ayo.org.nz', exact: true })).toHaveAttribute(
    'href',
    'mailto:ayo@ayo.org.nz',
  )
  await expect(page.getByRole('button', { name: 'Copy email', exact: true })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Your message' })).toHaveCount(0)
})

test('mobile menu opens, closes with Escape and follows a link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/contact-us')
  await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  const menu = page.getByRole('navigation', { name: 'Mobile navigation', exact: true })
  await expect(menu).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeFocused()
  await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  await menu.getByRole('link', { name: 'NEWS', exact: true }).click()
  await expect(page).toHaveURL(/\/news$/)
  await expect(page.getByRole('heading', { name: 'News', exact: true })).toBeVisible()
})
