import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  fields: [
    {
      name: 'eventName',
      type: 'text',
      required: true,
    },
    {
      name: 'eventDescription',
      type: 'text',
    },
    {
      name: 'eventVenue',
      type: 'text',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      required: true,
    },
    {
      name: 'finishDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      required: true,
      validate: (value, { siblingData }) => {
        const sibling = siblingData as { startDate: Date | null }

        if (!sibling.startDate) {
          return 'No start date has been set'
        }

        if ((value as Date) <= sibling.startDate) {
          return 'End date must be after start date'
        }

        return true
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        await fetch(process.env.APPS_SCRIPT_URL!, {
          method: 'POST',
          body: JSON.stringify({ doc, operation }),
        })
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await fetch(process.env.APPS_SCRIPT_URL!, {
          method: 'POST',
          body: JSON.stringify({ doc, operation: 'delete' }),
        })
      },
    ],
  },
}
