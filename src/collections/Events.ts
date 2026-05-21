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
      async ({ doc }) => {
        await fetch(
          'https://script.google.com/macros/s/AKfycbwHVd9raLE1Ae-M_VDC8QGfNlSXeJB0-ATVlNRQE8qmmf7BYdcDSlY9A1q9Q-Qxsu9FkA/exec',
          {
            method: 'POST',
            body: JSON.stringify({ doc }),
          },
        )
      },
    ],
  },
}
