import { test, expect } from '@playwright/test'
import { login } from '../helpers/login'

const email = process.env.AYO_TEST_ADMIN_EMAIL
const password = process.env.AYO_TEST_ADMIN_PASSWORD

test('admin login uses AYO branding', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(
    page.getByRole('img', { name: 'Auckland Youth Orchestra', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Email *', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible()
})

test.describe('Signed-in admin', () => {
  test.skip(
    !email || !password,
    'Set AYO_TEST_ADMIN_EMAIL and AYO_TEST_ADMIN_PASSWORD for an existing test account.',
  )

  test.beforeEach(async ({ page }) => {
    await login({ page, user: { email: email!, password: password! } })
  })

  test('can open the dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /^Kia ora,/ })).toBeVisible()
  })

  for (const collection of ['pages', 'posts', 'people', 'media']) {
    test(`can open ${collection}`, async ({ page }) => {
      await page.goto(`/admin/collections/${collection}`)
      await expect(
        page.getByRole('heading', { level: 1, name: new RegExp(`^${collection}$`, 'i') }),
      ).toBeVisible()
    })
  }
})
