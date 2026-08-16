import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { legacyProvenanceFields } from '@/fields/legacyProvenance'

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
    defaultColumns: ['title', 'year', 'verified', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
    },
    {
      name: 'authors',
      type: 'text',
      label: 'Автор / авторы',
      defaultValue: 'Н. П. Ведищев',
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
          label: 'Издательство',
        },
        {
          name: 'pageCount',
          type: 'number',
          label: 'Количество страниц',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isbn',
          type: 'text',
          label: 'ISBN',
        },
        {
          name: 'fullTextStatus',
          type: 'select',
          label: 'Статус полного текста',
          defaultValue: 'unknown',
          options: [
            { label: 'Неизвестно', value: 'unknown' },
            { label: 'Полный текст недоступен', value: 'unavailable' },
            { label: 'Есть каталог / карточка', value: 'catalog-only' },
            { label: 'Полный текст доступен в читальном зале', value: 'reading-room' },
            { label: 'Полный текст доступен онлайн', value: 'available-online' },
          ],
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
      label: 'Ссылка на источник / каталог',
    },
    slugField(),
    ...legacyProvenanceFields(),
  ],
  versions: {
    drafts: true,
  },
}
