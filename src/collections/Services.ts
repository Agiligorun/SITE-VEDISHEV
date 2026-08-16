import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { legacyProvenanceFields } from '@/fields/legacyProvenance'
import { legalRichText } from '@/fields/legalRichText'
import { seoFields } from '@/fields/seoFields'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Услуга',
    plural: 'Услуги',
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
      name: 'practiceAreas',
      type: 'relationship',
      relationTo: 'practice-areas',
      hasMany: true,
      label: 'Связанные направления практики',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Краткое описание',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: legalRichText,
      label: 'Подробное описание',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'order',
          type: 'number',
          label: 'Порядок',
        },
        {
          name: 'showOnHome',
          type: 'checkbox',
          label: 'Показывать на главной',
        },
      ],
    },
    ...seoFields(),
    ...legacyProvenanceFields(),
    slugField(),
  ],
  versions: {
    drafts: true,
  },
}
