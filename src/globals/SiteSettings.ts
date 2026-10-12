import type { GlobalConfig } from 'payload'

/**
 * Site settings:
 *
 * Site-wide values that aren't tied to a single page. Every field is
 * optional — anything left blank simply isn't rendered, so an empty
 * setting hides its link rather than pointing visitors at a dead URL.
 *
 * The navigation menu deliberately lives in code (NavBar/Footer) because it
 * mirrors the app's routes; only the outbound social links are editable here.
 */

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Administration',
    description: 'Social media links used by the footer and the Follow Us section.',
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
          admin: {
            description:
              'e.g. https://www.instagram.com/aucklandyouthorchestra/ — also names the account shown in the Follow Us section.',
          },
        },
        {
          name: 'youtube',
          type: 'text',
        },
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'linkedin',
          type: 'text',
        },
      ],
    },
  ],
}
