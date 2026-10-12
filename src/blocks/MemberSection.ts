import type { Block } from 'payload'

/**
 * Member section block:
 *
 * Supplies the heading and sub-line for one of the fixed sections of the
 * My AYO page. The sections themselves are built in code (they render the
 * calendar embed, the document lists and the password form), so each block
 * is matched to its section by `section` rather than by its position in the
 * layout — adding, reordering or removing blocks never reshuffles the page.
 *
 * - section: which My AYO section this copy belongs to
 * - heading: the section's heading
 * - subtitle: the italic line under the heading; omitted when left blank
 */

export const MemberSection: Block = {
  slug: 'member-section',
  labels: {
    singular: 'Member Section',
    plural: 'Member Sections',
  },
  fields: [
    {
      name: 'section',
      type: 'select',
      required: true,
      options: [
        { label: 'Member login', value: 'login' },
        { label: 'Calendar', value: 'calendar' },
        { label: 'Resources', value: 'resources' },
        { label: 'Links', value: 'links' },
      ],
      admin: {
        description:
          'Which section of the My AYO page this heading belongs to. One block per section.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      required: false,
    },
  ],
}
