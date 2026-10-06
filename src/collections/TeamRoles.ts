import type { CollectionConfig } from 'payload'

export const TeamRoles: CollectionConfig = {
    slug: 'team-roles',

    admin: {
        useAsTitle: 'displayName',
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
            defaultValue: 0,
            admin: {
                hidden: true,
            },
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
        {
            name: 'roleOrderPreview',
            type: 'ui',
            label: 'Display order',
            admin: {
                position: 'sidebar',
                components: {
                    Field: '@/admin/components/RolesOrderPreview#TeamRolesOrderPreview',
                },
            },
        },
        {
            name: 'rolePreview',
            type: 'ui',
            label: 'Current holders',
            admin: {
                position: 'sidebar',
                components: {
                    Field: '@/admin/components/RolesPreview#TeamRolesPreview',
                },
            },
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