import type { GlobalConfig } from 'payload'
import { validateWebURL } from '@/lib/urls'

/** Shared social links and explicit current-record choices for the website. */

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Administration',
    description: 'Social links and the current calendar and data agreement used by the website.',
  },
  // Read-only to the public: these URLs are rendered on every page anyway.
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'social',
      type: 'group',
      label: 'Social Media',
      admin: {
        description: 'Full profile URLs. Leave a field blank to hide that icon.',
      },
      fields: [
        {
          name: 'instagram',
          type: 'text',
          validate: validateWebURL,
          admin: {
            description:
              'For example, https://www.instagram.com/aucklandyouthorchestra/. This also names the account shown in Follow Us.',
          },
        },
        {
          name: 'youtube',
          type: 'text',
          validate: validateWebURL,
        },
        {
          name: 'facebook',
          type: 'text',
          validate: validateWebURL,
        },
        {
          name: 'linkedin',
          type: 'text',
          validate: validateWebURL,
        },
      ],
    },
    {
      name: 'currentContent',
      type: 'group',
      label: 'Current website records',
      // Keep member-calendar relationships out of the anonymous settings response.
      access: { read: ({ req }) => Boolean(req.user) },
      admin: {
        description:
          'Choose which saved records the website uses. If a choice is blank, the only saved record is used. With multiple records, select one here.',
      },
      fields: [
        {
          name: 'calendar',
          label: 'Current calendar',
          type: 'relationship',
          relationTo: 'calendar-links',
          maxDepth: 0,
        },
        {
          name: 'dataAgreement',
          label: 'Current data agreement',
          type: 'relationship',
          relationTo: 'processing-of-data-agreement',
          maxDepth: 0,
        },
      ],
    },
  ],
}
