/**
 * pnpm cms:populate       Preview the reviewed text import.
 * pnpm cms:populate:apply Create missing records after confirming the target.
 * Existing text is skipped, never overwritten. No reset runs.
 * Set POPULATE_CMS_IMAGES=1 to also fill missing images from the reviewed sources.
 * Set POPULATE_CMS_BIOS=1 to fill empty player biographies from the private input.
 * Private input: .private/cms-content/content.json, or set CMS_CONTENT_FILE.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCmsTarget, confirmCmsTarget } from './cmsScript'
import { populateCmsContent } from './populateCmsContent'
import { loadClientContent } from './clientContent/input'

const target = getCmsTarget(process.env, 'POPULATE')
const input = await loadClientContent()
const payload = await getPayload({ config })
try {
  await populateCmsContent({
    payload,
    input,
    target,
    apply: process.env.POPULATE_CMS_CONTENT === '1',
    includeImages: process.env.POPULATE_CMS_IMAGES === '1',
    fillMissingBios: process.env.POPULATE_CMS_BIOS === '1',
    confirm: confirmCmsTarget,
  })
} finally {
  await payload.destroy()
}
