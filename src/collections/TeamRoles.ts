import type { CollectionConfig } from 'payload'

export const TeamRoles: CollectionConfig = {
    slug: 'team-roles',

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
            name: 'roleType',
            type: 'select',
            required: true,
            options: [
                {
                    label: 'Executive Committee',
                    value: 'executive'
                },
                {
                    label: 'Administration',
                    value: 'admin'
                }
            ]
        },
        {
            name: 'displayName',
            type: 'text',
            admin: {
                hidden: true,
                readOnly: true,
            }
        },
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