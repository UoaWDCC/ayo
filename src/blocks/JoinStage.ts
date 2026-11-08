import type { Block, Field } from 'payload'
import { validateDocumentURL } from '@/lib/urls'

/**
 * Join stage block:
 *
 * The scroll-driven story on the Join AYO page. Each group below is one scene,
 * in the order the viewer scrolls through them:
 * - opening: the title over the closed curtains, and the curtain photo
 * - collage: a screen-filling board of overlapping, angled photos, with two lines of copy over them
 * - history: the milestones that slide past along the music staff
 * - sections: the orchestra's sections, one photo and a short description each
 * - crescendo / finale: single headings over a full-screen photo, before the call to action
 * - register: the closing call to action, over a full-screen photo
 *
 * Only offered on the Join AYO page (see the layout field's filterOptions in Pages).
 */

// The small uppercase line is only offered where it labels something (history,
// call to action); on the other scenes it was decoration.
const eyebrow: Field = {
  name: 'eyebrow',
  label: 'Small heading',
  type: 'text',
  admin: { description: 'The short uppercase line above the heading. Leave blank to hide it.' },
}

const heading = (name: string, label: string, withEyebrow = false): Field[] => [
  ...(withEyebrow ? [eyebrow] : []),
  { name, label, type: 'text', required: true },
]

const image: Field = {
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  admin: { description: 'Leave blank to show a grey placeholder.' },
}

const backdrop: Field = {
  ...image,
  name: 'image',
  label: 'Background photo',
  admin: {
    description:
      'Fills the screen behind the heading, darkened towards the text. Leave blank for plain black.',
  },
}

export const JoinStage: Block = {
  slug: 'join-stage',
  labels: {
    singular: 'Join AYO Scroll Story',
    plural: 'Join AYO Scroll Stories',
  },
  fields: [
    {
      name: 'opening',
      type: 'group',
      admin: { description: 'Shown over the closed curtains before they open.' },
      fields: [
        ...heading('heading', 'Heading'),
        { ...image, name: 'curtainImage', label: 'Curtain photo' },
      ],
    },
    {
      name: 'collage',
      label: 'Photo collage',
      type: 'group',
      fields: [
        {
          name: 'photos',
          type: 'array',
          maxRows: 24,
          admin: {
            description:
              'Up to 24 photos, spread across the whole screen in order from the top left. Around 20 fills it well; a label is optional.',
          },
          fields: [
            image,
            { name: 'label', type: 'text', admin: { description: 'One word shown on the photo.' } },
          ],
        },
        {
          name: 'firstLine',
          label: 'First line',
          type: 'group',
          fields: heading('heading', 'Heading'),
        },
        {
          name: 'secondLine',
          label: 'Second line',
          type: 'group',
          fields: heading('text', 'Text'),
        },
      ],
    },
    {
      name: 'history',
      type: 'group',
      fields: [
        ...heading('heading', 'Heading', true),
        {
          name: 'milestones',
          type: 'array',
          admin: { description: 'Shown left to right along the staff, in this order.' },
          fields: [
            { name: 'year', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'text' },
            image,
          ],
        },
      ],
    },
    {
      name: 'sections',
      label: 'Orchestra sections',
      type: 'group',
      fields: [
        {
          name: 'items',
          label: 'Sections',
          type: 'array',
          maxRows: 4,
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              name: 'description',
              type: 'textarea',
              admin: { description: 'One or two sentences shown under the section name.' },
            },
            image,
          ],
        },
      ],
    },
    {
      name: 'crescendo',
      type: 'group',
      fields: [...heading('heading', 'Heading'), backdrop],
    },
    {
      name: 'finale',
      type: 'group',
      fields: [...heading('heading', 'Heading'), backdrop],
    },
    {
      name: 'register',
      label: 'Call to action',
      type: 'group',
      fields: [
        ...heading('heading', 'Heading', true),
        {
          name: 'body',
          type: 'textarea',
          admin: { description: 'For example, when registrations close.' },
        },
        { name: 'buttonLabel', label: 'Button text', type: 'text' },
        {
          name: 'buttonUrl',
          label: 'Button link',
          type: 'text',
          validate: validateDocumentURL,
          admin: {
            description:
              'A full https:// URL, or a site path such as /contact-us. The button is hidden until both button fields are filled in.',
          },
        },
        { name: 'contactName', label: 'Enquiries contact', type: 'text' },
        { name: 'contactEmail', label: 'Enquiries email', type: 'email' },
        backdrop,
      ],
    },
  ],
}
