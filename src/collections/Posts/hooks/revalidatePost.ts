import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

const safelyRevalidate = (callback: () => void, onSkip: () => void) => {
  try {
    callback()
  } catch {
    onSkip()
  }
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      safelyRevalidate(() => {
        revalidatePath(path)
        revalidateTag('posts-sitemap', 'max')
      }, () => payload.logger.warn('Skipping post revalidation outside Next.js request context'))
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      safelyRevalidate(() => {
        revalidatePath(oldPath)
        revalidateTag('posts-sitemap', 'max')
      }, () => payload.logger.warn('Skipping old post revalidation outside Next.js request context'))
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/posts/${doc?.slug}`

    safelyRevalidate(() => {
      revalidatePath(path)
      revalidateTag('posts-sitemap', 'max')
    }, () => {})
  }

  return doc
}
