/**
 * pnpm cms:reset       Preview counts and the database/storage target.
 * pnpm cms:reset:apply Delete content after typing the exact target shown.
 *
 * Uses the current environment, just like `payload run`. Back up first and stop
 * the app before applying. Files cannot be rolled back with database history.
 * Admin accounts and My AYO member passwords are preserved.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { resetCmsContent } from './resetCmsContent'
import { getCmsTarget, confirmCmsTarget } from './cmsScript'

const target = getCmsTarget(process.env, 'RESET')
const payload = await getPayload({ config })
try {
  await resetCmsContent({
    payload,
    target,
    apply: process.env.RESET_CMS_CONTENT === '1',
    storageConfigured: Boolean(
      process.env.S3_ENDPOINT &&
      process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY,
    ),
    confirm: confirmCmsTarget,
  })
} finally {
  await payload.destroy()
}
