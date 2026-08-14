import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { legalRichText } from '@/fields/legalRichText'
import { seoFields } from '@/fields/seoFields'

export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: {
    singular: 'Кейс',
    plural: 'Кейсы',
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
      name: 'practiceArea',
      type: 'relationship',
      relationTo: 'practice-areas',
      label: 'Направление практики',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Краткое описание',
      required: true,
    },
    {
      name: 'situation',
      type: 'richText',
      editor: legalRichText,
      label: 'Ситуация',
    },
    {
      name: 'advocateWork',
      type: 'richText',
      editor: legalRichText,
      label: 'Работа адвоката',
    },
    {
      name: 'result',
      type: 'richText',
      editor: legalRichText,
      label: 'Результат',
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
          name: 'showOnHome',
          type: 'checkbox',
          label: 'Показывать на главной',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение',
    },
    ...seoFields(),
    slugField(),
  ],
  versions: {
    drafts: true,
  },
}
