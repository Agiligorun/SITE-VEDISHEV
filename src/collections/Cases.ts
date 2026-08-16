import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { legacyProvenanceFields } from '@/fields/legacyProvenance'
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
    defaultColumns: ['title', 'practiceArea', 'verified', 'updatedAt'],
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
      type: 'row',
      fields: [
        {
          name: 'caseCategory',
          type: 'text',
          label: 'Категория дела',
        },
        {
          name: 'decisionDate',
          type: 'date',
          label: 'Дата судебного акта',
        },
      ],
    },
    {
      name: 'situation',
      type: 'richText',
      editor: legalRichText,
      label: 'Ситуация',
    },
    {
      name: 'proceduralIssue',
      type: 'textarea',
      label: 'Процессуальная проблема',
    },
    {
      name: 'advocateWork',
      type: 'richText',
      editor: legalRichText,
      label: 'Позиция и работа защиты',
    },
    {
      name: 'result',
      type: 'richText',
      editor: legalRichText,
      label: 'Результат',
    },
    {
      name: 'relatedPublication',
      type: 'relationship',
      relationTo: 'publications',
      label: 'Связанная публикация',
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
    ...legacyProvenanceFields(),
    ...seoFields(),
    slugField(),
  ],
  versions: {
    drafts: true,
  },
}
