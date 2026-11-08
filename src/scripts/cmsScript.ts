import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

export function getCmsTarget(
  env: Partial<NodeJS.ProcessEnv>,
  action: 'RESET' | 'POPULATE',
): string {
  const match = env.DATABASE_URL?.match(
    /^mongodb(?:\+srv)?:\/\/(?:[^/]*@)?([^/?#]+)\/([^/?#]+)(?:\?[^#]*)?$/,
  )
  if (!match) throw new Error('DATABASE_URL must specify a MongoDB host and database name.')
  const database = `${match[1]}/${match[2]}`
  const endpoint = env.S3_ENDPOINT ? new URL(env.S3_ENDPOINT) : undefined
  if (
    endpoint &&
    (!['https:', 'http:'].includes(endpoint.protocol) || endpoint.username || endpoint.password)
  )
    throw new Error('S3_ENDPOINT must be an HTTP(S) endpoint without credentials.')
  const storage = endpoint && env.S3_BUCKET ? `${endpoint.host}/${env.S3_BUCKET}` : 'not configured'
  return `${action} ${database} | media ${storage}`
}

export async function confirmCmsTarget(phrase: string): Promise<string> {
  if (!stdin.isTTY)
    throw new Error('Apply requires an interactive terminal. Run the dry run instead.')
  const prompt = createInterface({ input: stdin, output: stdout })
  try {
    return await prompt.question(`\nTo apply the changes, type exactly:\n${phrase}\n> `)
  } finally {
    prompt.close()
  }
}
