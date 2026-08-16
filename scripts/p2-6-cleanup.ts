// @ts-nocheck
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const CLEANUP_TARGETS = [
  {
    collection: 'practice-areas',
    slugs: [
      'criminal-law',
      'civil-disputes',
      'arbitration',
      'family-law',
      'inheritance-law',
      'housing-disputes',
      'administrative-cases',
      'international-cases',
    ],
    reason: 'Bootstrap demo practice areas from P1 placeholders.',
  },
  {
    collection: 'posts',
    slugs: ['article-legal-risk', 'article-case-strategy', 'article-process', 'article-consultation'],
    reason: 'Bootstrap demo posts from P1 placeholders.',
  },
  {
    collection: 'publications',
    slugs: ['publication-1', 'publication-2', 'publication-3'],
    reason: 'Bootstrap demo publications from P1 placeholders.',
  },
  {
    collection: 'posts',
    slugs: ['smoke-20260816083117'],
    reason: 'Manual smoke test post artifact.',
  },
] as const

function parseArgs() {
  const args = process.argv.slice(2)
  const execute = args.includes('--execute')

  return { execute }
}

async function deleteBySlug(payload, collection: string, slug: string, execute: boolean) {
  const found = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const doc = found.docs[0]

  if (!doc) {
    return { collection, slug, status: 'missing', id: null }
  }

  if (!execute) {
    return { collection, slug, status: 'would-delete', id: doc.id }
  }

  await payload.delete({
    collection,
    id: doc.id,
  })

  return { collection, slug, status: 'deleted', id: doc.id }
}

async function deleteSmokeMedia(payload, execute: boolean) {
  const found = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 50,
    pagination: false,
    sort: 'id',
  })

  const smokeItems = found.docs.filter((doc) => {
    const combined = [doc.alt, doc.filename].filter(Boolean).join(' ').toLowerCase()
    return combined.includes('smoke')
  })

  const results = []

  for (const doc of smokeItems) {
    if (!execute) {
      results.push({ collection: 'media', slug: doc.filename || String(doc.id), status: 'would-delete', id: doc.id })
      continue
    }

    await payload.delete({
      collection: 'media',
      id: doc.id,
    })

    results.push({ collection: 'media', slug: doc.filename || String(doc.id), status: 'deleted', id: doc.id })
  }

  return results
}

async function main() {
  const { execute } = parseArgs()
  const payload = await getPayload({ config: configPromise })
  const results = []

  for (const target of CLEANUP_TARGETS) {
    for (const slug of target.slugs) {
      results.push({
        ...(await deleteBySlug(payload, target.collection, slug, execute)),
        reason: target.reason,
      })
    }
  }

  for (const mediaResult of await deleteSmokeMedia(payload, execute)) {
    results.push({
      ...mediaResult,
      reason: 'Manual smoke test media artifact.',
    })
  }

  console.log(
    JSON.stringify(
      {
        mode: execute ? 'execute' : 'dry-run',
        results,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
