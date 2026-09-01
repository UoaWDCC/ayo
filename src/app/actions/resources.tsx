'use server'
// used to use local api within client component in resources for /my-ayo
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getResources() {
  const payload = await getPayload({ config })

  const resources = await payload.find({
    collection: 'link',
    where: {
      category: {
        equals: 'resources',
      },
    },
  })

  return resources
}
