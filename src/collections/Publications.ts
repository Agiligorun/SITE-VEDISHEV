import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { legacyProvenanceFields } from '@/fields/legacyProvenance'
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
    defaultColumns: ['title', 'type', 'source', 'verified', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'text',
          label: 'Источник / журнал',
          required: true,
        },
        {
          name: 'authors',
          type: 'text',
          label: 'Автор / авторы',
          defaultValue: 'Н. П. Ведищев',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Тип',
          required: true,
          defaultValue: 'professional',
          options: [
            { label: 'Научная статья', value: 'academic' },
            { label: 'Профессиональная статья', value: 'professional' },
            { label: 'СМИ', value: 'media' },
            { label: 'Интервью', value: 'interview' },
            { label: 'Комментарий', value: 'commentary' },
            { label: 'Конференция', value: 'conference' },
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
      type: 'row',
      fields: [
        {
          name: 'issue',
          type: 'text',
          label: 'Номер / выпуск',
        },
        {
          name: 'pageRange',
          type: 'text',
          label: 'Страницы',
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
      label: 'Краткая аннотация',
    },
    ...legacyProvenanceFields(),
    ...seoFields(),
    slugField(),
  ],
  versions: {
    drafts: true,
  },
}
