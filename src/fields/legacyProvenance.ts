import type { Field } from 'payload'

export const legacyProvenanceFields = (): Field[] => [
  {
    type: 'collapsible',
    label: 'Источник и верификация',
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'sourceType',
        type: 'select',
        label: 'Тип источника',
        defaultValue: 'legacy-site',
        options: [
          { label: 'Старый сайт', value: 'legacy-site' },
          { label: 'Официальный сайт', value: 'official-site' },
          { label: 'Библиотечный каталог', value: 'library-catalog' },
          { label: 'СМИ / интервью', value: 'media' },
          { label: 'Ручная редактура', value: 'editorial' },
        ],
      },
      {
        name: 'legacySourceUrl',
        type: 'text',
        label: 'URL исходного материала',
      },
      {
        name: 'legacySlug',
        type: 'text',
        label: 'Legacy slug / идентификатор',
      },
      {
        name: 'legacyPublishedAt',
        type: 'date',
        label: 'Дата исходной публикации',
      },
      {
        name: 'verified',
        type: 'checkbox',
        label: 'Фактологически проверено',
        defaultValue: false,
      },
      {
        name: 'verificationNote',
        type: 'textarea',
        label: 'Комментарий по проверке',
      },
    ],
  },
]
