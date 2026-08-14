import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const ConsultationRequests: CollectionConfig = {
  slug: 'consultation-requests',
  labels: {
    singular: 'Заявка на консультацию',
    plural: 'Заявки на консультацию',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'messenger',
      type: 'text',
      label: 'Мессенджер',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Сообщение',
    },
    {
      name: 'sourcePage',
      type: 'text',
      label: 'Источник заявки',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      defaultValue: 'new',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В работе', value: 'in_progress' },
        { label: 'Закрыта', value: 'closed' },
      ],
    },
  ],
}
