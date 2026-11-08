import { getPayload } from 'payload'
import config from '@payload-config'
import { getCmsTarget, confirmCmsTarget } from './cmsScript'
import { populateCmsContent } from './populateCmsContent'
import { loadClientContent } from './clientContent/input'
import type { JoinStoryInput } from './clientContent/input'
import { readFile } from 'node:fs/promises'

const target = getCmsTarget(process.env, 'POPULATE')
const input = await loadClientContent()
input.joinStory ??= JSON.parse(
  await readFile(new URL('./clientContent/joinStory.json', import.meta.url), 'utf8'),
) as JoinStoryInput
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
