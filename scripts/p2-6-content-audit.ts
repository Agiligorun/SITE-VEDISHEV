// @ts-nocheck
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Classification = 'LEGACY_IMPORTED' | 'REAL_MANUAL' | 'BOOTSTRAP_DEMO' | 'UNKNOWN'

const OUTPUT_MARKDOWN = path.resolve(process.cwd(), 'docs/content/P2_6_CONTENT_INVENTORY.md')
const OUTPUT_JSON = path.resolve(process.cwd(), '.tmp/p2_6_content_inventory.json')

const COLLECTIONS = [
  { slug: 'practice-areas', label: 'PracticeAreas' },
  { slug: 'services', label: 'Services' },
  { slug: 'posts', label: 'Posts' },
  { slug: 'publications', label: 'Publications' },
  { slug: 'books', label: 'Books' },
  { slug: 'cases', label: 'Cases' },
  { slug: 'videos', label: 'Videos' },
  { slug: 'media', label: 'Media' },
] as const

const DEMO_SLUGS = {
  'practice-areas': new Set([
    'criminal-law',
    'civil-disputes',
    'arbitration',
    'family-law',
    'inheritance-law',
    'housing-disputes',
    'administrative-cases',
    'international-cases',
  ]),
  posts: new Set([
    'article-legal-risk',
    'article-case-strategy',
    'article-consultation',
    'article-process',
  ]),
  publications: new Set(['publication-1', 'publication-2', 'publication-3']),
  services: new Set<string>(),
  books: new Set<string>(),
  cases: new Set<string>(),
  videos: new Set<string>(),
  media: new Set<string>(),
} as const

const DEMO_TITLES = new Set([
  'Комментарий по правовым вопросам публикуется после проверки источников',
  'Научные и экспертные материалы будут подключены через CMS',
  'Интервью и комментарии будут опубликованы после верификации',
  'Что делать при первом разговоре с адвокатом',
  'Как оспорить отказ в принятии наследства',
  'Новые изменения в жилищном законодательстве 2026 года',
  'На что обратить внимание при заключении договора',
  'Гражданские дела',
  'Арбитражные споры',
  'Семейные споры',
  'Наследственные дела',
  'Жилищные споры',
  'Административные дела',
  'Международные дела',
])

const DEMO_MARKERS = [
  'p1 bootstrap',
  'placeholder',
  'заполнитель',
  'будет подтвержден',
  'будут подключены через cms',
  'будут опубликованы после верификации',
  'материал-заполнитель',
  'черновой контент',
  'временный текст',
  'проверки итоговой геометрии',
  'до публикации реального',
]

function isSmokeArtifact(record: Record<string, any>) {
  const combined = [
    record.title,
    record.slug,
    record.alt,
    record.filename,
    record.meta?.description,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return combined.includes('smoke') || combined.includes('test upload')
}

function isMalformedImportedFragment(collectionSlug: string, record: Record<string, any>) {
  if (!['publications', 'books'].includes(collectionSlug)) return false

  const title = String(record.title || '').trim()

  if (!title) return true
  if (/^\d+$/.test(title)) return true
  if (/^№$/i.test(title)) return true
  if (/^с\.\s*[\d\-–]+/i.test(title)) return true
  if (/^\//.test(title)) return true
  if (/\b\d+\s*с\.\s*[-–]?\s*\d+(?:[.,]\d+)?\s*п\.л\./i.test(title)) return true
  if (collectionSlug === 'publications' && title.length < 6) return true

  return false
}

function extractPlainText(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(extractPlainText).filter(Boolean).join(' ')
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).map(extractPlainText).filter(Boolean).join(' ')
  }
  return String(value)
}

function escapeCell(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  return String(value).replace(/\|/g, '\\|').replace(/\n+/g, '<br />')
}

function classifyRecord(collectionSlug: string, record: Record<string, any>, options: {
  heroPortraitId?: number | null
  profilePortraitId?: number | null
}): { classification: Classification; reason: string } {
  const slug = record.slug ? String(record.slug) : ''
  const title = String(record.title || record.alt || record.filename || '').trim()
  const combined = extractPlainText(record).toLowerCase()
  const legacySourceUrl = record.legacySourceUrl ? String(record.legacySourceUrl) : ''
  const legacySlug = record.legacySlug ? String(record.legacySlug) : ''
  const sourceType = record.sourceType ? String(record.sourceType) : ''
  const verified = typeof record.verified === 'boolean' ? record.verified : null

  if (collectionSlug === 'media') {
    if (isSmokeArtifact(record)) {
      return {
        classification: 'REAL_MANUAL',
        reason: 'Manual smoke/acceptance media artifact.',
      }
    }

    const usedAsPortrait = Number(record.id) === options.heroPortraitId || Number(record.id) === options.profilePortraitId
    if (
      combined.includes('историческая фотография со старого сайта advokat-vnp.ru') ||
      combined.includes('advokat-vnp.ru/upload/pages/1.jpg') ||
      combined.includes('advokat-vnp.ru/upload/pages/3.jpg')
    ) {
      return {
        classification: 'LEGACY_IMPORTED',
        reason: 'Media matches imported legacy portrait metadata.',
      }
    }

    if (usedAsPortrait) {
      return {
        classification: 'LEGACY_IMPORTED',
        reason: 'Media is used as hero/profile portrait in site settings.',
      }
    }

    return {
      classification: 'UNKNOWN',
      reason: 'Media has no legacy provenance fields and is not a known bootstrap asset.',
    }
  }

  if (isSmokeArtifact(record)) {
    return {
      classification: 'REAL_MANUAL',
      reason: 'Manual smoke/acceptance content artifact.',
    }
  }

  if (DEMO_SLUGS[collectionSlug as keyof typeof DEMO_SLUGS]?.has(slug)) {
    return {
      classification: 'BOOTSTRAP_DEMO',
      reason: 'Slug matches bootstrap-placeholders.ts.',
    }
  }

  if (DEMO_TITLES.has(title)) {
    return {
      classification: 'BOOTSTRAP_DEMO',
      reason: 'Title matches bootstrap placeholder content.',
    }
  }

  if (DEMO_MARKERS.some((marker) => combined.includes(marker))) {
    return {
      classification: 'BOOTSTRAP_DEMO',
      reason: 'Record body/meta still contains bootstrap placeholder markers.',
    }
  }

  if ((legacySourceUrl || legacySlug || sourceType || verified !== null) && isMalformedImportedFragment(collectionSlug, record)) {
    return {
      classification: 'UNKNOWN',
      reason: 'Imported provenance exists, but the title looks like a parser fragment rather than a standalone record.',
    }
  }

  if (legacySourceUrl || legacySlug || sourceType || verified !== null) {
    return {
      classification: 'LEGACY_IMPORTED',
      reason: 'Record carries legacy/import provenance fields.',
    }
  }

  return {
    classification: 'REAL_MANUAL',
    reason: 'No bootstrap markers and no import provenance; treat as manual until proven otherwise.',
  }
}

function getDisplayTitle(collectionSlug: string, record: Record<string, any>) {
  if (collectionSlug === 'media') {
    return record.alt || record.filename || `media:${record.id}`
  }

  return record.title || record.slug || `${collectionSlug}:${record.id}`
}

function parseArgs() {
  const args = process.argv.slice(2)
  const jsonOnly = args.includes('--json')

  return { jsonOnly }
}

async function main() {
  const { jsonOnly } = parseArgs()
  const payload = await getPayload({ config: configPromise })
  const siteSettings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const home = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    depth: 0,
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  const homepageRefs = {
    areas: new Set<number>(),
    posts: new Set<number>(),
    publications: new Set<number>(),
    books: new Set<number>(),
  }

  for (const block of home.docs[0]?.layout || []) {
    for (const area of block?.areas || []) homepageRefs.areas.add(Number(area))
    for (const post of block?.articles || []) homepageRefs.posts.add(Number(post))
    for (const publication of block?.publications || []) homepageRefs.publications.add(Number(publication))
    for (const book of block?.books || []) homepageRefs.books.add(Number(book))
  }

  const allCollections = []

  for (const collection of COLLECTIONS) {
    const result = await payload.find({
      collection: collection.slug,
      depth: 0,
      draft: false,
      limit: 200,
      pagination: false,
      sort: 'id',
    })

    const rows = result.docs.map((record) => {
      const { classification, reason } = classifyRecord(collection.slug, record, {
        heroPortraitId: siteSettings?.heroPortrait,
        profilePortraitId: siteSettings?.profilePortrait,
      })

      const homepage =
        (collection.slug === 'practice-areas' && homepageRefs.areas.has(Number(record.id))) ||
        (collection.slug === 'posts' && homepageRefs.posts.has(Number(record.id))) ||
        (collection.slug === 'publications' && homepageRefs.publications.has(Number(record.id))) ||
        (collection.slug === 'books' && homepageRefs.books.has(Number(record.id)))

      return {
        id: record.id,
        title: getDisplayTitle(collection.slug, record),
        slug: record.slug || null,
        _status: record._status || null,
        legacySourceUrl: record.legacySourceUrl || null,
        legacySlug: record.legacySlug || null,
        sourceType: record.sourceType || null,
        verified: typeof record.verified === 'boolean' ? record.verified : null,
        createdAt: record.createdAt || null,
        updatedAt: record.updatedAt || null,
        classification,
        reason,
        homepage,
        filename: record.filename || null,
      }
    })

    allCollections.push({
      ...collection,
      total: rows.length,
      rows,
    })
  }

  const payloadOut = {
    generatedAt: new Date().toISOString(),
    siteSettings: {
      heroPortrait: siteSettings?.heroPortrait || null,
      profilePortrait: siteSettings?.profilePortrait || null,
    },
    homepageRefs: {
      areas: [...homepageRefs.areas],
      posts: [...homepageRefs.posts],
      publications: [...homepageRefs.publications],
      books: [...homepageRefs.books],
    },
    collections: allCollections,
  }

  await mkdir(path.dirname(OUTPUT_JSON), { recursive: true })
  await writeFile(OUTPUT_JSON, JSON.stringify(payloadOut, null, 2), 'utf8')

  if (jsonOnly) {
    console.log(JSON.stringify(payloadOut, null, 2))
    return
  }

  const lines: string[] = [
    '# P2.6 Content Inventory',
    '',
    `Generated: ${payloadOut.generatedAt}`,
    '',
    '## Summary',
    '',
    '| Collection | Total | LEGACY_IMPORTED | REAL_MANUAL | BOOTSTRAP_DEMO | UNKNOWN |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
  ]

  for (const collection of allCollections) {
    const counts = {
      LEGACY_IMPORTED: 0,
      REAL_MANUAL: 0,
      BOOTSTRAP_DEMO: 0,
      UNKNOWN: 0,
    }

    for (const row of collection.rows) {
      counts[row.classification] += 1
    }

    lines.push(
      `| ${collection.label} | ${collection.total} | ${counts.LEGACY_IMPORTED} | ${counts.REAL_MANUAL} | ${counts.BOOTSTRAP_DEMO} | ${counts.UNKNOWN} |`,
    )
  }

  for (const collection of allCollections) {
    lines.push('', `## ${collection.label}`, '')
    lines.push(
      '| id | title | _status | legacySourceUrl | legacySlug | sourceType | verified | createdAt | updatedAt | classification | notes |',
      '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    )

    for (const row of collection.rows) {
      const notes = [
        row.slug ? `slug=${row.slug}` : '',
        row.homepage ? 'homepage=true' : '',
        row.filename ? `filename=${row.filename}` : '',
        row.reason,
      ]
        .filter(Boolean)
        .join('; ')

      lines.push(
        `| ${escapeCell(row.id)} | ${escapeCell(row.title)} | ${escapeCell(row._status)} | ${escapeCell(
          row.legacySourceUrl,
        )} | ${escapeCell(row.legacySlug)} | ${escapeCell(row.sourceType)} | ${escapeCell(
          row.verified,
        )} | ${escapeCell(row.createdAt)} | ${escapeCell(row.updatedAt)} | ${row.classification} | ${escapeCell(notes)} |`,
      )
    }
  }

  await mkdir(path.dirname(OUTPUT_MARKDOWN), { recursive: true })
  await writeFile(OUTPUT_MARKDOWN, lines.join('\n'), 'utf8')

  console.log(JSON.stringify(payloadOut, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
