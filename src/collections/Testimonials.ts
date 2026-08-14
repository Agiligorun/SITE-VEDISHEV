import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Отзыв',
    plural: 'Отзывы',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Текст отзыва',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'publishedAt',
          type: 'date',
          label: 'Дата публикации',
        },
        {
          name: 'source',
          type: 'text',
          label: 'Источник',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          label: 'Статус',
          defaultValue: 'pending',
          options: [
            { label: 'Ожидает', value: 'pending' },
            { label: 'Подтвержден', value: 'approved' },
            { label: 'Отклонен', value: 'rejected' },
          ],
        },
        {
          name: 'showOnHome',
          type: 'checkbox',
          label: 'Показывать на главной',
        },
      ],
    },
  ],
  versions: {
    drafts: true,
  },
}
