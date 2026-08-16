import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { legacyProvenanceFields } from '@/fields/legacyProvenance'
import { legalRichText } from '@/fields/legalRichText'
import { seoFields } from '@/fields/seoFields'

export const PracticeAreas: CollectionConfig = {
  slug: 'practice-areas',
  labels: {
    singular: 'Направление практики',
    plural: 'Направления практики',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
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
    },
    {
      name: 'iconLabel',
      type: 'text',
      label: 'Короткая подпись для иконки',
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
