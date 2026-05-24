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
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        await fetch(
          'LINK GOES HERE BUT I CANT PUT IT HERE BECAUSE WE NEED TO HIDE IT BUT IDK HOW',
          {
            method: 'POST',
            body: JSON.stringify({ doc, operation }),
          },
        )
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await fetch('LINK GOES HERE BUT I CANT PUT IT HERE BECAUSE WE NEED TO HIDE IT', {
          method: 'POST',
          body: JSON.stringify({ doc, operation: 'delete' }),
        })
      },
    ],
  },
}
