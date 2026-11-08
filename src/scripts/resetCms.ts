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
