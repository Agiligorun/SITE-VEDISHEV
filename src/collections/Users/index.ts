import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Администрирование',
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Роль',
      defaultValue: 'editor',
      options: [
        {
          label: 'Редактор',
          value: 'editor',
        },
        {
          label: 'Владелец',
          value: 'owner',
        },
      ],
    },
  ],
  timestamps: true,
}
