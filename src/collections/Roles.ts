import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
    slug: 'roles',

    admin: {
        useAsTitle: 'displayName'
    },

    fields: [
        {
            name: 'roleName',
            type: 'text',
            required: true,
        },
        {
            name: 'sortOrder',
            type: 'number',
            required: true,
        },
        {
            name: 'displayName',
            type: 'text',
            admin: {
                hidden: true,
                readOnly: true,
            }
        }
    ],

    hooks: {
        beforeChange: [
            ({ data }) => {
                data.displayName = `${data.sortOrder} - ${data.roleName}`
                return data
            }
        ]
    }
}