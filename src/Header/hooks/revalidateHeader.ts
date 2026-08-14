import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    try {
      revalidateTag('global_header', 'max')
    } catch (error) {
      payload.logger.warn({ err: error }, 'Skipping header revalidation outside Next.js request context')
    }
  }

  return doc
}
