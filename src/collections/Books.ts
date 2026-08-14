import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

export const Books: CollectionConfig = {
  slug: 'books',
  labels: {
    singular: 'Книга',
    plural: 'Книги',
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
          name: 'year',
          type: 'number',
          label: 'Год',
        },
        {
          name: 'publisher',
          type: 'text',
          label: 'Издатель',
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
      name: 'url',
      type: 'text',
      label: 'Внешняя ссылка',
    },
  ],
  versions: {
    drafts: true,
  },
}
