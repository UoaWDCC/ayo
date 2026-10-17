import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

type LoginOptions = {
  page: Page
  user: { email: string; password: string }
}

export async function login({ page, user }: LoginOptions): Promise<void> {
  await page.goto('/admin/login')
  await page.getByRole('textbox', { name: 'Email *', exact: true }).fill(user.email)
  await page.getByLabel(/^Password/).fill(user.password)
  await page.getByRole('button', { name: 'Login', exact: true }).click()
  await expect(page).toHaveURL(/\/admin$/)
  await expect(page.getByRole('heading', { name: /^Kia ora,/ })).toBeVisible()
}
