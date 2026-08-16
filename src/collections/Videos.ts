import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { legacyProvenanceFields } from '@/fields/legacyProvenance'

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: {
    singular: 'Видео',
    plural: 'Видео',
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
      label: 'Название',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'provider',
          type: 'select',
          label: 'Платформа',
          defaultValue: 'youtube',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'VK Video', value: 'vk' },
            { label: 'Rutube', value: 'rutube' },
            { label: 'Другое', value: 'other' },
          ],
        },
        {
          name: 'publishedAt',
          type: 'date',
          label: 'Дата публикации',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: 'Обложка',
    },
    {
      name: 'externalURL',
      type: 'text',
      label: 'Внешняя ссылка',
    },
    slugField(),
    ...legacyProvenanceFields(),
  ],
  versions: {
    drafts: true,
  },
}
