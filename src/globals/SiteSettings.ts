import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { link } from '@/fields/link'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'Настройки сайта',
  },
  label: 'Настройки сайта',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'fullName',
          type: 'text',
          label: 'ФИО',
          required: true,
        },
        {
          name: 'professionalStatus',
          type: 'text',
          label: 'Профессиональный статус',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Телефон',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'address',
          type: 'text',
          label: 'Адрес',
        },
        {
          name: 'workingHours',
          type: 'text',
          label: 'Часы работы',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'telegram',
          type: 'text',
          label: 'Telegram',
        },
        {
          name: 'whatsApp',
          type: 'text',
          label: 'WhatsApp / мессенджер',
        },
      ],
    },
    {
      name: 'advocateDetails',
      type: 'textarea',
      label: 'Реквизиты адвокатского образования',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'heroPortrait',
          type: 'upload',
          relationTo: 'media',
          label: 'Портрет для Hero',
        },
        {
          name: 'profilePortrait',
          type: 'upload',
          relationTo: 'media',
          label: 'Портрет для блока "Об адвокате"',
        },
      ],
    },
    {
      name: 'primaryCTA',
      type: 'group',
      label: 'Основной CTA',
      fields: [link()],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Социальные ссылки',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Название',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Юридические ссылки',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Название',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'footerNote',
      type: 'textarea',
      label: 'Текст в footer',
    },
    {
      name: 'consultationDisclaimer',
      type: 'textarea',
      label: 'Юридическая оговорка для формы консультации',
    },
  ],
}
