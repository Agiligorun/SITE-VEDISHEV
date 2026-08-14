import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import {
  AboutProfileBlock,
  ArticlesGridBlock,
  ConsultationCtaBlock,
  ContactsBlock,
  FAQBlock,
  HeroBlock,
  PracticeGridBlock,
  PublicationsListBlock,
  TrustStripBlock,
} from '../../blocks/Vedishev/config'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  labels: {
    singular: 'Страница',
    plural: 'Страницы',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
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
      name: 'layout',
      type: 'blocks',
      blocks: [
        HeroBlock,
        TrustStripBlock,
        PracticeGridBlock,
        AboutProfileBlock,
        PublicationsListBlock,
        ArticlesGridBlock,
        FAQBlock,
        ConsultationCtaBlock,
        ContactsBlock,
      ],
      required: true,
      admin: {
        initCollapsed: true,
      },
      label: 'Секции страницы',
    },
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
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
}
