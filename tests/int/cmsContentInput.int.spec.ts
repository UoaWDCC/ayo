import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { loadClientContent } from '@/scripts/clientContent/input'
import { cmsContentFixture } from '../fixtures/cmsContent'

let directory: string | undefined
afterEach(async () => {
  if (directory) await rm(directory, { recursive: true, force: true })
  directory = undefined
})

async function inputFile(text: string) {
  directory = await mkdtemp(path.join(tmpdir(), 'cms-input-'))
  const file = path.join(directory, 'content.json')
  await writeFile(file, text)
  return file
}

describe('Private CMS input', () => {
  it('loads an explicitly supplied JSON file', async () => {
    expect(await loadClientContent(await inputFile(JSON.stringify(cmsContentFixture)))).toEqual(
      cmsContentFixture,
    )
  })

  it('fails clearly when the private input is missing', async () => {
    await expect(
      loadClientContent(path.join(tmpdir(), 'missing-cms-input', 'content.json')),
    ).rejects.toThrow('Set CMS_CONTENT_FILE')
  })

  it('does not expose private JSON text in parsing errors', async () => {
    const file = await inputFile('{"private": "example confidential text" invalid}')
    await expect(loadClientContent(file)).rejects.toThrow('Private CMS input must be valid JSON.')
  })

  it('rejects incomplete input instead of silently creating partial content', async () => {
    await expect(loadClientContent(await inputFile('{}'))).rejects.toThrow('pages array')
  })
})
