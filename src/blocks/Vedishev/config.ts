import { link } from '@/fields/link'
import { legalRichText } from '@/fields/legalRichText'
import type { Block, Field } from 'payload'

const introFields: Field[] = [
  {
    name: 'eyebrow',
    type: 'text',
    label: 'Надзаголовок',
  },
  {
    name: 'heading',
    type: 'text',
    label: 'Заголовок',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Описание',
  },
]

export const HeroBlock: Block = {
  slug: 'legalHero',
  interfaceName: 'LegalHeroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Hero',
  },
  fields: [
    ...introFields,
    {
      name: 'lead',
      type: 'textarea',
      label: 'Лид',
    },
    {
      name: 'primaryLink',
      type: 'group',
      label: 'Основной CTA',
      fields: [link()],
    },
    {
      name: 'secondaryLink',
      type: 'group',
      label: 'Вторичный CTA',
      fields: [link()],
    },
    {
      name: 'portraitPlaceholder',
      type: 'textarea',
      label: 'Подпись к placeholder-фото',
    },
  ],
}

export const TrustStripBlock: Block = {
  slug: 'trustStrip',
  interfaceName: 'TrustStripBlock',
  labels: {
    singular: 'Полоса доверия',
    plural: 'Полоса доверия',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 3,
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Описание',
        },
      ],
    },
  ],
}

export const PracticeGridBlock: Block = {
  slug: 'practiceGrid',
  interfaceName: 'PracticeGridBlock',
  labels: {
    singular: 'Сетка практики',
    plural: 'Сетка практики',
  },
  fields: [
    ...introFields,
    {
      name: 'areas',
      type: 'relationship',
      relationTo: 'practice-areas',
      hasMany: true,
      label: 'Направления практики',
      required: true,
    },
    {
      name: 'inlineFormTitle',
      type: 'text',
      label: 'Заголовок формы справа',
      defaultValue: 'Нужна помощь адвоката?',
    },
  ],
}

export const AboutProfileBlock: Block = {
  slug: 'aboutProfile',
  interfaceName: 'AboutProfileBlock',
  labels: {
    singular: 'Об адвокате',
    plural: 'Об адвокате',
  },
  fields: [
    ...introFields,
    {
      name: 'content',
      type: 'richText',
      editor: legalRichText,
      label: 'Основной текст',
      required: true,
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Ключевые акценты',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Описание',
        },
      ],
    },
    {
      name: 'profileLink',
      type: 'group',
      label: 'Ссылка "Подробнее"',
      fields: [link()],
    },
  ],
}

export const PublicationsListBlock: Block = {
  slug: 'publicationsList',
  interfaceName: 'PublicationsListBlock',
  labels: {
    singular: 'Публикации',
    plural: 'Публикации',
  },
  fields: [
    ...introFields,
    {
      name: 'publications',
      type: 'relationship',
      relationTo: 'publications',
      hasMany: true,
      label: 'Публикации',
      required: true,
    },
  ],
}

export const ArticlesGridBlock: Block = {
  slug: 'articlesGrid',
  interfaceName: 'ArticlesGridBlock',
  labels: {
    singular: 'Статьи',
    plural: 'Статьи',
  },
  fields: [
    ...introFields,
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Статьи',
      required: true,
    },
  ],
}

export const FAQBlock: Block = {
  slug: 'faqBlock',
  interfaceName: 'FAQBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQ',
  },
  fields: [
    ...introFields,
    {
      name: 'items',
      type: 'array',
      label: 'Вопросы и ответы',
      required: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Вопрос',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          editor: legalRichText,
          label: 'Ответ',
          required: true,
        },
      ],
    },
  ],
}

export const ContactsBlock: Block = {
  slug: 'contactsBlock',
  interfaceName: 'ContactsBlock',
  labels: {
    singular: 'Контакты',
    plural: 'Контакты',
  },
  fields: [...introFields],
}

export const ConsultationCtaBlock: Block = {
  slug: 'consultationCta',
  interfaceName: 'ConsultationCtaBlock',
  labels: {
    singular: 'Консультация',
    plural: 'Консультация',
  },
  fields: [
    ...introFields,
    {
      name: 'formTitle',
      type: 'text',
      label: 'Заголовок формы',
      defaultValue: 'Записаться на консультацию',
    },
  ],
}
