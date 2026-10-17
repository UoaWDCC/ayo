import type { CollectionConfig } from 'payload'

/**
 * The shared passwords that unlock /my-ayo. Any one of these documents grants
 * access, so deleting the last one locks members out of the page entirely.
 *
 * Grouped into Administration so the collection is reachable from the sidebar
 * and the dashboard. Hiding it from the nav never protected it — the list view
 * and the REST API were always reachable by URL — so access control is the only
 * thing that limits who can read these values.
 */
export const Passwords: CollectionConfig = {
  slug: 'passwords',
  admin: {
    group: 'Administration',
    description: 'Shared passwords for the My AYO page.',
    defaultColumns: ['password', 'updatedAt'],
  },
  fields: [
    {
      name: 'password',
      type: 'text',
      admin: {
        description: 'Share this with members. Any password listed here unlocks the page.',
      },
    },
  ],
}
