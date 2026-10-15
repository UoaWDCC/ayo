import type { GlobalConfig } from 'payload'
import { validateWebURL } from '@/lib/urls'

/** Shared social links and the current My AYO calendar. */

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Administration',
    description: 'Social media links and the current calendar used by My AYO.',
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
      label: 'My AYO calendar',
      // Keep member-calendar relationships out of the anonymous settings response.
      access: { read: ({ req }) => Boolean(req.user) },
      admin: {
        description:
          'Choose the calendar shown in My AYO. If this choice is blank, the only saved calendar is used. With multiple calendars, select one here.',
      },
      fields: [
        {
          name: 'calendar',
          label: 'Current calendar',
          type: 'relationship',
          relationTo: 'calendar-links',
          maxDepth: 0,
        },
      ],
    },
  ],
}
