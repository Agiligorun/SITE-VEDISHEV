import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    try {
      revalidateTag('global_footer', 'max')
    } catch (error) {
      payload.logger.warn({ err: error }, 'Skipping footer revalidation outside Next.js request context')
    }
  }

  return doc
}
