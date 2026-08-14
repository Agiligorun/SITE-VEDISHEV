import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { seoFields } from '@/fields/seoFields'

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: {
    singular: 'Публикация',
    plural: 'Публикации',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
    },
    {
      name: 'source',
      type: 'text',
      label: 'Источник',
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
          name: 'type',
          type: 'select',
          label: 'Тип',
          required: true,
          defaultValue: 'media',
          options: [
            { label: 'СМИ', value: 'media' },
            { label: 'Научная', value: 'academic' },
            { label: 'Интервью', value: 'interview' },
            { label: 'Другое', value: 'other' },
          ],
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL публикации',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Логотип / изображение',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    ...seoFields(),
    slugField(),
  ],
  versions: {
    drafts: true,
  },
}
