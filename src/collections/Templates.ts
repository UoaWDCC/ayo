import type { Field } from 'payload'

/**
 * Payload field templates / examples
 */

export const TextFieldExample: Field = {
  name: 'title', // Data Fields have a `name` property. This is the key used to store the field's value
  type: 'text', // Saves a string to the database and provides the Admin Panel with a simple text input
}

// Select type: Provides a dropdown-style interface for choosing options from a predefined list
export const SelectFieldExample: Field = {
  name: 'category',
  type: 'select',
  options: [
    { label: 'Blog', value: 'blog' },
    { label: 'Alumni Story', value: 'alumni_story' },
  ],
}

// Upload type: Allows for the selection of a Document from a Collection supporting Uploads
export const UploadFieldExample: Field = {
  name: 'logo',
  type: 'upload',
  relationTo: 'media', // Which collection this field links to (media in this case)
}

// Array type: Used when you need to have a set of repeating Fields
export const ArrayFieldExample: Field = {
  name: 'performances',
  type: 'array',
  fields: [
    {
      name: 'dateTime',
      type: 'date',
    },
    {
      name: 'venue',
      type: 'text',
    },
    {
      name: 'bookingUrl',
      type: 'text',
    },
  ],
}
