import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

const safelyRevalidate = (callback: () => void, onSkip: () => void) => {
  try {
    callback()
  } catch {
    onSkip()
  }
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      safelyRevalidate(() => {
        revalidatePath(path)
        revalidateTag('pages-sitemap', 'max')
      }, () => payload.logger.warn('Skipping page revalidation outside Next.js request context'))
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      safelyRevalidate(() => {
        revalidatePath(oldPath)
        revalidateTag('pages-sitemap', 'max')
      }, () => payload.logger.warn('Skipping old page revalidation outside Next.js request context'))
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    safelyRevalidate(() => {
      revalidatePath(path)
      revalidateTag('pages-sitemap', 'max')
    }, () => {})
  }

  return doc
}
