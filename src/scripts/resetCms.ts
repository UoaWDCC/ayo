/**
 * pnpm cms:reset       Preview counts and the database/storage target.
 * pnpm cms:reset:apply Delete content after typing the exact target shown.
 *
 * Uses the current environment, just like `payload run`. Back up first and stop
 * the app before applying. Files cannot be rolled back with database history.
 */
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { getPayload } from 'payload'
import config from '@payload-config'
import { resetCmsContent, resetTarget } from './resetCmsContent'

const target = resetTarget(process.env)
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
    confirm: async (phrase) => {
      if (!stdin.isTTY)
        throw new Error('Apply requires an interactive terminal. Run the dry run instead.')
      const prompt = createInterface({ input: stdin, output: stdout })
      try {
        return await prompt.question(
          `\nPermanently delete the listed content and media? Type exactly:\n${phrase}\n> `,
        )
      } finally {
        prompt.close()
      }
    },
  })
} finally {
  await payload.destroy()
}
