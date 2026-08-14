import type { Field } from 'payload'

export const seoFields = (): Field[] => [
  {
    name: 'meta',
    label: 'SEO',
    type: 'group',
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'SEO title',
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        label: 'SEO image',
      },
      {
        name: 'description',
        type: 'textarea',
        label: 'SEO description',
      },
    ],
  },
]
