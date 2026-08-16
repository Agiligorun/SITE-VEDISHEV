// @ts-nocheck
import { spawnSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import configPromise from '@payload-config'
import { JSDOM } from 'jsdom'
import { getPayload, type File } from 'payload'

let payloadInstance: Awaited<ReturnType<typeof getPayload>> | null = null

const curlBin = process.platform === 'win32' ? 'curl.exe' : 'curl'

const LEGACY_URLS = {
  home: 'http://advokat-vnp.ru/',
  contacts: 'http://advokat-vnp.ru/page/7/kontakty',
  books: 'http://advokat-vnp.ru/page/20/monografii',
  academic: 'http://advokat-vnp.ru/page/19/nauchnye-statji-opublikovannye-v-veduschih-recenziruemyh-zhurnalah-i-izdanijah-rekomendovannyh-vysshej-attestacionnoj-komissiej-ministerstva-obrazovanija-i-nauki-rossijskoj-federacii',
  professional: 'http://advokat-vnp.ru/page/21/nauchnye-statji-opublikovannye-v-inyh-izdanijah',
  article1: 'http://advokat-vnp.ru/page/9/novyj-zakon-novye-problemy-u-advokatov',
  article2: 'http://advokat-vnp.ru/page/10/vstupiteljnye-zajavlenija-storon-chasti-2-i-3-statji-335-upk-rf',
  article3: 'http://advokat-vnp.ru/page/17/proizvodnye-narkoticheskih-sredstv-i-psihotropnyh-veschestv-da-ili-net',
  case1: 'http://advokat-vnp.ru/page/8/postanovlenie-prezidiuma-mosgorsuda-ot-16112012-goda-po-delu-44u-53012',
  case2: 'http://advokat-vnp.ru/page/11/opredelenie-ot-27-aprelja-2006-goda-verhovnogo-suda-rf-delo-n-5-d05-299',
  case3: 'http://advokat-vnp.ru/page/12/postanovlenie-moskovskogo-gorodskogo-suda-ot-14022013-po-delu-n-4u-47713',
  case4: 'http://advokat-vnp.ru/page/16/opredelenie-verhovnogo-suda-rf-ot-28012010-n-32-009-65sp',
  video1: 'http://advokat-vnp.ru/page/15/sud-prisjazhnyh-v-rossii',
  video2: 'http://advokat-vnp.ru/page/18/intervjju-advokata-vedischeva-np-po-delu-ocimika-ae',
  imageHero: 'http://advokat-vnp.ru/upload/pages/1.jpg',
  imageProfile: 'http://advokat-vnp.ru/upload/pages/3.jpg',
}

const OFFICIAL_SOURCES = {
  mgkaProfile: 'https://mgka1866.ru/advocate/vedishchev-nikolay-pavlovich/',
  mgka2025Book:
    'https://mgka1866.ru/2025/05/12/vyshla-v-svet-kniga-n-p-vedishheva-preodolenie-sudebnyh-oshibok-pri-podgotovke-k-zashhite-i-v-zashhite-v-sude-prisyazhnyh/',
  advokatymoscowAward:
    'https://advokatymoscow.ru/press/news/laureatam-vysshikh-advokatskikh-nagrad-vrucheny-znaki/',
  raaCatalog2024:
    'https://lib.rpa-mu.ru/catalog/product/vedischev_n_p_narushenie_prava_na_zaschitu_v_sude_pervoy_instantsii_v_ugolovnom_sudoproizvodstve_rossii_monografiya/',
  rusneb2020:
    'https://rusneb.ru/catalog/000199_000009_010651084/',
  fparf2026:
    'https://fparf.ru/news/fpa/v-preddverii-dnya-rossiyskoy-advokatury-vyshel-v-svet-sbornik-o-zashchite-prav-grazhdan-v-rossii/',
}

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}

const PRACTICE_AREAS = [
  {
    slug: 'criminal-defense',
    title: 'Уголовные дела',
    shortDescription: 'Защита по уголовным делам на ключевых стадиях производства и при выборе процессуальной стратегии.',
    content: [
      'Основная специализация Николая Павловича Ведищева связана с уголовным судопроизводством, защитой по сложным делам и аналитической работой с судебными ошибками.',
      'Практика строится на сочетании адвокатской защиты, процессуальной тактики и глубокого знания уголовно-процессуального закона.',
    ],
    iconLabel: 'УП',
    order: 1,
  },
  {
    slug: 'pretrial-defense',
    title: 'Защита на стадии проверки и следствия',
    shortDescription: 'Правовая помощь на этапе доследственной проверки, дознания и предварительного следствия.',
    content: [
      'В научных и профессиональных публикациях Николая Павловича отдельно рассматриваются вопросы допуска защитника, работы с материалами проверки и оценки доказательств до передачи дела в суд.',
    ],
    iconLabel: 'ДС',
    order: 2,
  },
  {
    slug: 'trial-defense',
    title: 'Защита в суде',
    shortDescription: 'Подготовка позиции защиты, работа с доказательствами и выступления в суде первой инстанции.',
    content: [
      'Судебная работа включает подготовку правовой позиции, анализ процессуальных нарушений и выстраивание убедительной линии защиты по существу обвинения.',
    ],
    iconLabel: 'СУ',
    order: 3,
  },
  {
    slug: 'jury-trials',
    title: 'Суд присяжных',
    shortDescription: 'Отдельная экспертная специализация по делам, рассматриваемым с участием присяжных заседателей.',
    content: [
      'Суд присяжных является одной из наиболее заметных профессиональных тем в практике и научных работах Николая Павловича Ведищева.',
    ],
    iconLabel: 'ПР',
    order: 4,
  },
  {
    slug: 'appeals-and-cassation',
    title: 'Обжалование приговоров и кассация',
    shortDescription: 'Защита в апелляции, кассации, надзоре и при исправлении судебных ошибок.',
    content: [
      'Отдельное направление работы связано с пересмотром судебных актов, кассационным производством и устранением судебных ошибок.',
    ],
    iconLabel: 'КА',
    order: 5,
  },
  {
    slug: 'new-circumstances',
    title: 'Новые и вновь открывшиеся обстоятельства',
    shortDescription: 'Пересмотр уголовных дел ввиду новых и вновь открывшихся обстоятельств.',
    content: [
      'Эта тема последовательно проходит через книги Николая Павловича и составляет важную часть его научной специализации.',
    ],
    iconLabel: 'НО',
    order: 6,
  },
  {
    slug: 'traffic-crimes',
    title: 'Автотранспортные преступления',
    shortDescription: 'Дела, связанные с дорожно-транспортными преступлениями и экспертизами.',
    content: [
      'Старые научные публикации фиксируют устойчивый интерес к защите по делам об автотранспортных преступлениях и к работе с экспертными заключениями.',
    ],
    iconLabel: 'ДТ',
    order: 7,
  },
  {
    slug: 'drug-related-cases',
    title: 'Дела о наркотических средствах',
    shortDescription: 'Защита по делам о наркотических средствах, психотропных веществах и производных составах.',
    content: [
      'В публикациях Николая Павловича подробно анализируются спорные вопросы квалификации и экспертной оценки по делам, связанным с наркотическими средствами и психотропными веществами.',
    ],
    iconLabel: 'НС',
    order: 8,
  },
]

const SERVICES = [
  {
    slug: 'defense-at-pretrial-check',
    title: 'Защита при доследственной проверке',
    practiceAreas: ['pretrial-defense'],
    shortDescription: 'Подключение адвоката до возбуждения уголовного дела и сопровождение процессуальных действий.',
    content: [
      'Работа начинается с оценки рисков, помощи при объяснениях и выстраивания правовой позиции с учетом возможного дальнейшего преследования.',
    ],
    order: 1,
  },
  {
    slug: 'court-defense',
    title: 'Защита в суде первой инстанции',
    practiceAreas: ['trial-defense', 'criminal-defense'],
    shortDescription: 'Подготовка линии защиты, исследование доказательств и выступления в судебном процессе.',
    content: [
      'Судебная защита включает системную работу с материалами дела, допросами, письменными доказательствами и правовыми возражениями.',
    ],
    order: 2,
  },
  {
    slug: 'jury-defense',
    title: 'Защита в суде присяжных',
    practiceAreas: ['jury-trials', 'trial-defense'],
    shortDescription: 'Подготовка позиции для процесса с участием присяжных заседателей.',
    content: [
      'Особое внимание уделяется вступительным заявлениям сторон, постановке вопросов присяжным и предотвращению процессуальных нарушений.',
    ],
    order: 3,
  },
  {
    slug: 'appeals-and-supervisory-review',
    title: 'Кассация и надзор',
    practiceAreas: ['appeals-and-cassation', 'new-circumstances'],
    shortDescription: 'Подготовка жалоб и защита при пересмотре судебных актов.',
    content: [
      'Это направление включает кассационное производство, надзор и подготовку позиции для преодоления судебных ошибок.',
    ],
    order: 4,
  },
]

const ARTICLE_CONFIG = [
  {
    slug: 'novyy-zakon-novye-problemy-u-advokatov',
    title: 'Новый закон - новые проблемы у адвокатов',
    url: LEGACY_URLS.article1,
    publishedAt: '2013-09-01T00:00:00.000Z',
    categories: ['Уголовный процесс', 'Профессиональная статья'],
    practiceAreas: ['pretrial-defense', 'criminal-defense'],
    excerpt:
      'Анализ изменений в УПК РФ после принятия Федерального закона от 4 марта 2013 года N 23-ФЗ и их влияния на работу защитника на этапе проверки сообщений о преступлении.',
    seoDescription:
      'Профессиональная статья Николая Павловича Ведищева о роли адвоката на стадии проверки сообщения о преступлении и новых рисках применения УПК РФ.',
  },
  {
    slug: 'vstupitelnye-zayavleniya-storon-statya-335-upk-rf',
    title: 'Вступительные заявления сторон (части 2 и 3 статьи 335 УПК РФ)',
    url: LEGACY_URLS.article2,
    publishedAt: '2010-01-01T00:00:00.000Z',
    categories: ['Суд присяжных', 'Профессиональная статья'],
    practiceAreas: ['jury-trials', 'trial-defense'],
    excerpt:
      'Разбор особенностей вступительных заявлений государственного обвинителя и защитника в суде с участием присяжных заседателей.',
    seoDescription:
      'Статья Николая Павловича Ведищева о вступительных заявлениях сторон и процессуальных рисках в суде присяжных.',
  },
  {
    slug: 'proizvodnye-narkoticheskikh-sredstv-da-ili-net',
    title: 'Производные наркотических средств и психотропных веществ: да или нет',
    url: LEGACY_URLS.article3,
    publishedAt: '2013-01-01T00:00:00.000Z',
    categories: ['Наркотические преступления', 'Профессиональная статья'],
    practiceAreas: ['drug-related-cases', 'criminal-defense'],
    excerpt:
      'Профессиональный анализ понятия «производные наркотических средств и психотропных веществ» и проблем экспертной квалификации.',
    seoDescription:
      'Статья Николая Павловича Ведищева о спорной квалификации производных наркотических средств и процессуальных последствиях для защиты.',
  },
]

const CASE_CONFIG = [
  {
    slug: 'prezidium-mosgorsuda-44u-530-12',
    title: 'Постановление Президиума Мосгорсуда от 16.11.2012 по делу № 44у-530/12',
    url: LEGACY_URLS.case1,
    practiceArea: 'appeals-and-cassation',
    shortDescription: 'Материал о пересмотре судебных актов по надзорной жалобе адвоката в интересах обвиняемого.',
    proceduralIssue: 'Надзорный пересмотр судебных актов и оценка законности меры пресечения.',
    year: 2012,
  },
  {
    slug: 'vs-rf-5-d05-299',
    title: 'Определение Верховного Суда РФ от 27.04.2006 по делу N 5-Д05-299',
    url: LEGACY_URLS.case2,
    practiceArea: 'appeals-and-cassation',
    shortDescription: 'Материал о пересмотре приговора и судебных решений в Верховном Суде РФ.',
    proceduralIssue: 'Надзорная жалоба адвоката по уголовному делу экономической направленности.',
    year: 2006,
  },
  {
    slug: 'mosgorsud-4u-477-13',
    title: 'Постановление Московского городского суда от 14.02.2013 по делу N 4у-477/13',
    url: LEGACY_URLS.case3,
    practiceArea: 'appeals-and-cassation',
    shortDescription: 'Материал о возбуждении надзорного производства по жалобе адвоката в защиту интересов обвиняемого.',
    proceduralIssue: 'Оценка оснований для надзорного пересмотра судебных решений.',
    year: 2013,
  },
  {
    slug: 'vs-rf-32-009-65sp',
    title: 'Определение Верховного Суда РФ от 28.01.2010 N 32-009-65СП',
    url: LEGACY_URLS.case4,
    practiceArea: 'jury-trials',
    shortDescription: 'Материал о кассационном рассмотрении дела с участием присяжных заседателей.',
    proceduralIssue: 'Процессуальные вопросы по делу, рассмотренному судом присяжных.',
    year: 2010,
  },
]

const VIDEO_CONFIG = [
  {
    slug: 'sud-prisyazhnykh-v-rossii',
    title: 'Суд присяжных в России',
    url: LEGACY_URLS.video1,
    description:
      'Краткий материал старого сайта о видеовыступлении Николая Павловича Ведищева по вопросам института суда присяжных.',
  },
  {
    slug: 'intervyu-po-delu-otsimika',
    title: 'Интервью адвоката Ведищева Н.П. по делу Оцимика А.Е.',
    url: LEGACY_URLS.video2,
    description:
      'Исторический видео-материал о комментарии по результатам рассмотрения вопроса о продлении содержания под стражей.',
  },
]

const ADDITIONAL_BOOKS = [
  {
    slug: 'tipichnye-oshibki-v-zashchite-2020',
    title:
      'Типичные ошибки, допускаемые при подготовке к защите и в процессе защиты в суде первой инстанции по уголовным делам',
    authors: 'Н. П. Ведищев',
    year: 2020,
    publisher: 'Юрлитинформ',
    pageCount: 544,
    isbn: '978-5-4396-2099-5',
    url: OFFICIAL_SOURCES.rusneb2020,
    fullTextStatus: 'catalog-only',
    description:
      'Книга подтверждена карточкой РГБ / НЭБ и дополняет линейку работ о подготовке к защите и судебных ошибках.',
    sourceType: 'library-catalog',
    legacySourceUrl: OFFICIAL_SOURCES.rusneb2020,
    verified: true,
    verificationNote: 'Подтверждено библиотечной карточкой НЭБ / РГБ.',
    publish: true,
  },
  {
    slug: 'narushenie-prava-na-zashchitu-v-sude-pervoy-instantsii-2024',
    title:
      'Нарушение права на защиту в суде первой инстанции в уголовном судопроизводстве России',
    authors: 'Н. П. Ведищев',
    year: 2024,
    publisher: 'Юрлитинформ',
    pageCount: 480,
    isbn: '978-5-4396-2651-5',
    url: OFFICIAL_SOURCES.raaCatalog2024,
    fullTextStatus: 'catalog-only',
    description:
      'Монография, подтвержденная карточкой научной библиотеки Российской академии адвокатуры и нотариата.',
    sourceType: 'library-catalog',
    legacySourceUrl: OFFICIAL_SOURCES.raaCatalog2024,
    verified: true,
    verificationNote: 'Подтверждено библиотечной карточкой РААН.',
    publish: true,
  },
  {
    slug: 'preodolenie-sudebnykh-oshibok-v-sude-prisyazhnykh-2025',
    title:
      'Преодоление судебных ошибок при подготовке к защите и в защите в суде присяжных',
    authors: 'Н. П. Ведищев',
    year: 2025,
    publisher: 'Юрлитинформ',
    url: OFFICIAL_SOURCES.mgka2025Book,
    fullTextStatus: 'catalog-only',
    description:
      'Книга, о выходе которой сообщила Московская городская коллегия адвокатов в мае 2025 года.',
    sourceType: 'official-site',
    legacySourceUrl: OFFICIAL_SOURCES.mgka2025Book,
    verified: true,
    verificationNote: 'Подтверждено новостью МГКА от 12 мая 2025 года.',
    publish: true,
  },
  {
    slug: 'zashchita-prav-grazhdan-v-rossii-2026',
    title: 'Защита прав граждан в России',
    authors: 'Под ред. Н. П. Ведищева',
    year: 2026,
    publisher: 'Сборник статей',
    url: OFFICIAL_SOURCES.fparf2026,
    fullTextStatus: 'catalog-only',
    description:
      'Сборник, о выходе которого сообщила Федеральная палата адвокатов РФ в июне 2026 года.',
    sourceType: 'official-site',
    legacySourceUrl: OFFICIAL_SOURCES.fparf2026,
    verified: true,
    verificationNote: 'Подтверждено новостью ФПА РФ от 5 июня 2026 года.',
    publish: false,
  },
]

const DRY_RUN_REPORT_PATH = 'docs/content/P2_5_PRODUCTION_DRY_RUN.md'
const REPORT_GROUPS = ['practiceAreas', 'services', 'posts', 'publications', 'books', 'cases', 'videos', 'media', 'homepage']

function normalizeWhitespace(input: string) {
  return input.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
}

function richTextParagraphs(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs
        .map((text) => normalizeWhitespace(text))
        .filter(Boolean)
        .map((text) => ({
          type: 'paragraph',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text,
              version: 1,
            },
          ],
        })),
    },
  }
}

function runCurl(url: string, extraArgs: string[] = []) {
  const result = spawnSync(curlBin, ['-L', '--silent', '--show-error', '--max-time', '25', ...extraArgs, url], {
    encoding: 'buffer',
    maxBuffer: 20 * 1024 * 1024,
  })

  if (result.status !== 0) {
    throw new Error(`curl failed for ${url}: ${result.stderr?.toString() || result.status}`)
  }

  return result.stdout
}

function fetchLegacyHtml(url: string) {
  return runCurl(url).toString('utf8')
}

function fetchRemoteFile(url: string): File {
  const data = runCurl(url)
  const name = url.split('/').pop() || `file-${Date.now()}`
  const ext = name.split('.').pop()?.toLowerCase() || 'jpg'
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'

  return {
    name,
    data,
    mimetype: mime,
    size: data.byteLength,
  }
}

function extractMainCell(html: string) {
  const dom = new JSDOM(html)
  const { document } = dom.window
  const cell =
    document.querySelector('td[style*="padding:20px 20px 0px 20px"]') ||
    document.querySelector('td[style*="width:692px"]')

  if (!cell) {
    throw new Error('Legacy content container not found')
  }

  return { document, cell }
}

function extractStructuredParagraphs(url: string) {
  const html = fetchLegacyHtml(url)
  const { document, cell } = extractMainCell(html)
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  const title = document.querySelector('title')?.textContent?.trim() || ''

  const blocks: string[] = []

  for (const node of Array.from(cell.childNodes)) {
    if (node.nodeType !== 1) continue

    const element = node as HTMLElement
    const tag = element.tagName.toLowerCase()

    if (tag === 'script' || tag === 'style') continue

    if (tag === 'ul' || tag === 'ol') {
      for (const li of Array.from(element.querySelectorAll(':scope > li'))) {
        const value = normalizeWhitespace(li.textContent || '')
        if (value) blocks.push(`• ${value}`)
      }
      continue
    }

    const text = normalizeWhitespace(element.textContent || '')

    if (!text) continue
    if (text === '--------------------------------') continue
    if (text.startsWith('Copyright ©')) continue
    if (text === ' ') continue

    blocks.push(text)
  }

  return {
    title,
    metaDescription: normalizeWhitespace(metaDescription),
    paragraphs: blocks,
  }
}

function extractMainText(url: string, heading: string) {
  const { paragraphs } = extractStructuredParagraphs(url)
  const joined = paragraphs.join(' ')
  const startIndex = joined.indexOf('1.')
  const content = startIndex >= 0 ? joined.slice(startIndex) : joined.replace(heading, '').trim()

  return content
}

function splitNumberedEntries(text: string) {
  return text
    .split(/(?=\d+\.\s)/)
    .map((entry) => normalizeWhitespace(entry))
    .filter(Boolean)
}

function parseBookEntry(entry: string) {
  const cleaned = entry.replace(/^\d+\.\s*/, '')
  const titleMatch = cleaned.match(/Ведищев\s+Н\.П\.\s+(.+?)\.\s+М\.:/i)
  const title = titleMatch?.[1]?.trim() || cleaned
  const year = Number(cleaned.match(/\b(19|20)\d{2}\b/)?.[0] || 0) || undefined
  const pageCount = Number(cleaned.match(/(\d+)\s*с\./i)?.[1] || 0) || undefined
  const publisherMatch = cleaned.match(/М\.\:\s*"?([^".]+)"?\./)
  const publisher = publisherMatch?.[1]?.trim() || 'Юрлитинформ'

  return {
    title,
    authors: 'Н. П. Ведищев',
    year,
    publisher,
    pageCount,
    description: cleaned,
  }
}

function parsePublicationEntry(entry: string, type: string) {
  const cleaned = entry.replace(/^\d+\.\s*/, '').trim()
  const rawWithoutAuthor = cleaned.replace(/^Ведищев\s+Н\.П\.\s*/i, '')
  const authorPrefix = cleaned.startsWith('Ведищев Н.П.,') ? cleaned.split(rawWithoutAuthor)[0] : 'Ведищев Н.П.'
  const authors = authorPrefix.includes(',') ? authorPrefix.replace(/\.$/, '').replace(/\s+/g, ' ').trim() : 'Н. П. Ведищев'
  const parts = rawWithoutAuthor.split('//')
  const title = normalizeWhitespace((parts[0] || rawWithoutAuthor).replace(/\.$/, ''))
  const citation = normalizeWhitespace(parts[1] || rawWithoutAuthor)
  const year = Number(citation.match(/\b(19|20)\d{2}\b/)?.[0] || 0) || undefined
  const issue = citation.match(/(?:№|N)\s*([0-9A-Za-z\-()]+)/)?.[1]
  const pageRange = citation.match(/С\.\s*([0-9\-–]+)/)?.[1]
  const source = normalizeWhitespace(
    (parts[1] || '')
      .replace(/\b(19|20)\d{2}\b.*$/, '')
      .replace(/^\s*\/\s*/g, '')
      .replace(/\.$/, ''),
  )

  return {
    title,
    authors: authors.replace('Ведищев Н.П.', 'Н. П. Ведищев'),
    source: source || 'Историческая библиография advokat-vnp.ru',
    issue,
    pageRange,
    year,
    type,
    description: cleaned,
  }
}

function parseArgs() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const reportArg = args.find((arg) => arg.startsWith('--report='))
  const reportPath = reportArg ? reportArg.slice('--report='.length) : DRY_RUN_REPORT_PATH

  return {
    dryRun,
    reportPath,
  }
}

function emptyCounts() {
  return {
    create: 0,
    update: 0,
    skip: 0,
    verify: 0,
  }
}

function createOperationSummary() {
  return Object.fromEntries(REPORT_GROUPS.map((group) => [group, emptyCounts()]))
}

function track(summary, group, action) {
  if (!group) return
  summary[group][action] += 1
}

function normalizeForCompare(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map((item) => normalizeForCompare(item))

  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce((acc, key) => {
        const current = (value as Record<string, unknown>)[key]
        if (current !== undefined) {
          acc[key] = normalizeForCompare(current)
        }
        return acc
      }, {} as Record<string, unknown>)
  }

  return value
}

function pickComparable(source: any, template: any): any {
  if (template === null || template === undefined) return template
  if (Array.isArray(template)) {
    if (!Array.isArray(source)) return source
    if (!template.length) return source
    return source.map((item, index) => pickComparable(item, template[Math.min(index, template.length - 1)]))
  }

  if (template && typeof template === 'object') {
    return Object.keys(template).reduce((acc, key) => {
      acc[key] = pickComparable(source?.[key], template[key])
      return acc
    }, {} as Record<string, unknown>)
  }

  return source
}

function equivalentSubset(existing: any, desired: any) {
  const normalizedExisting = normalizeForCompare(pickComparable(existing, desired))
  const normalizedDesired = normalizeForCompare(desired)

  return JSON.stringify(normalizedExisting) === JSON.stringify(normalizedDesired)
}

function legacyConflict(existing: any, desired: any) {
  if (!existing || !desired) return false

  const existingLegacySlug = existing.legacySlug || existing.legacy_slug
  const existingLegacySource = existing.legacySourceUrl || existing.legacy_source_url

  if (existingLegacySlug && desired.legacySlug && existingLegacySlug !== desired.legacySlug) {
    return true
  }

  if (existingLegacySource && desired.legacySourceUrl && existingLegacySource !== desired.legacySourceUrl) {
    return true
  }

  return false
}

function syntheticDoc(collection: string, slug: string, data: Record<string, unknown>, existing?: any) {
  return {
    ...(existing || {}),
    ...data,
    id: existing?.id || `dry:${collection}:${slug}`,
    slug,
  }
}

function toStableAsciiSlug(value: string) {
  const transliterated = value
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC_TO_LATIN[char] ?? char)
    .join('')

  const sanitized = transliterated
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (sanitized) {
    return sanitized
  }

  return `item-${Buffer.from(value).toString('hex').slice(0, 12)}`
}

async function upsertBySlug(payload, collection, slug, data, options = {}) {
  const { dryRun = false, group = null, summary = null } = options
  const existing = await payload.find({
    collection,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const current = existing.docs[0]

  if (current && legacyConflict(current, data)) {
    track(summary, group, 'verify')
    return syntheticDoc(collection, slug, data, current)
  }

  if (current && equivalentSubset(current, data)) {
    track(summary, group, 'skip')
    return syntheticDoc(collection, slug, data, current)
  }

  if (current) {
    if (dryRun) {
      track(summary, group, 'update')
      return syntheticDoc(collection, slug, data, current)
    }

    track(summary, group, 'update')
    return payload.update({
      collection,
      id: current.id,
      data,
      context: {
        disableRevalidate: true,
      },
    })
  }

  if (dryRun) {
    track(summary, group, 'create')
    return syntheticDoc(collection, slug, data)
  }

  track(summary, group, 'create')
  return payload.create({
    collection,
    data: {
      ...data,
      slug,
    },
    context: {
      disableRevalidate: true,
    },
  })
}

async function upsertGlobal(payload, slug, data, options = {}) {
  const { dryRun = false, group = null, summary = null } = options
  const current = await payload.findGlobal({
    slug,
  })

  if (equivalentSubset(current, data)) {
    track(summary, group, 'skip')
    return {
      ...current,
      ...data,
    }
  }

  if (dryRun) {
    track(summary, group, 'update')
    return {
      ...current,
      ...data,
    }
  }

  track(summary, group, 'update')
  return payload.updateGlobal({
    slug,
    data,
    context: {
      disableRevalidate: true,
    },
  })
}

async function ensureMedia(payload, url: string, alt: string, note: string, options = {}) {
  const { dryRun = false, group = null, summary = null } = options
  const filename = url.split('/').pop()
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    pagination: false,
    where: {
      filename: {
        equals: filename,
      },
    },
  })

  const data = {
    filename,
    alt,
    caption: richTextParagraphs([note]),
  }

  const current = existing.docs[0]

  if (current && equivalentSubset(current, data)) {
    track(summary, group, 'skip')
    return {
      ...current,
      ...data,
      id: current.id,
    }
  }

  if (current) {
    if (dryRun) {
      track(summary, group, 'update')
      return {
        ...current,
        ...data,
        id: current.id,
      }
    }

    track(summary, group, 'update')
    return payload.update({
      collection: 'media',
      id: current.id,
      data,
      context: {
        disableRevalidate: true,
      },
    })
  }

  if (dryRun) {
    track(summary, group, 'create')
    return {
      ...data,
      id: `dry:media:${filename}`,
      url,
    }
  }

  track(summary, group, 'create')
  return payload.create({
    collection: 'media',
    data,
    file: fetchRemoteFile(url),
    context: {
      disableRevalidate: true,
    },
  })
}

async function ensureCategories(payload, titles: string[], options = {}) {
  const idsByTitle = new Map<string, number>()

  for (const title of titles) {
    const slug = toStableAsciiSlug(title)

    const doc = await upsertBySlug(
      payload,
      'categories',
      slug,
      {
        title,
        _status: 'published',
      },
      options,
    )

    idsByTitle.set(title, doc.id)
  }

  return idsByTitle
}

function placeholderOrEmpty(value: unknown, placeholderPatterns: RegExp[]) {
  if (typeof value !== 'string') return ''

  const normalized = value.trim()
  if (!normalized) return ''

  return placeholderPatterns.some((pattern) => pattern.test(normalized)) ? '' : normalized
}

function renderDryRunReport(summary) {
  const rows = [
    ['Practice Areas', summary.practiceAreas],
    ['Services', summary.services],
    ['Posts', summary.posts],
    ['Publications', summary.publications],
    ['Books', summary.books],
    ['Cases', summary.cases],
    ['Videos', summary.videos],
    ['Media', summary.media],
    ['Homepage', summary.homepage],
  ]

  const lines = [
    '# P2.5 Production Dry Run',
    '',
    `Date: ${new Date().toISOString()}`,
    '',
    '| Group | CREATE | UPDATE | SKIP | VERIFY |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...rows.map(
      ([label, counts]: [string, Record<string, number>]) =>
        `| ${label} | ${counts.create} | ${counts.update} | ${counts.skip} | ${counts.verify} |`,
    ),
    '',
    '## Safety notes',
    '',
    '- Import is keyed by stable slugs and legacy provenance identifiers.',
    '- Repeated runs should update or skip existing records instead of creating duplicates.',
    '- Cases remain draft-first and keep `verified=false` until manual review.',
    '- Legacy contacts are not auto-published as fake placeholders.',
    '- Conflicting provenance should be counted as `VERIFY` and reviewed before write.',
    '',
  ]

  return lines.join('\n')
}

async function writeDryRunReport(reportPath: string, summary) {
  const absolutePath = path.resolve(process.cwd(), reportPath)
  await mkdir(path.dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, renderDryRunReport(summary), 'utf8')
}

async function main() {
  const { dryRun, reportPath } = parseArgs()
  const summary = createOperationSummary()
  const payload = await getPayload({ config: configPromise })
  payloadInstance = payload

  const heroPortrait = await ensureMedia(
    payload,
    LEGACY_URLS.imageHero,
    'Николай Павлович Ведищев. Историческая фотография со старого сайта advokat-vnp.ru.',
    `Историческая фотография с ${LEGACY_URLS.imageHero}. Используется как временный подтвержденный портрет до получения более современного исходника.`,
    { dryRun, group: 'media', summary },
  )

  const profilePortrait = await ensureMedia(
    payload,
    LEGACY_URLS.imageProfile,
    'Николай Павлович Ведищев. Историческая фотография со старого сайта advokat-vnp.ru.',
    `Историческая фотография с ${LEGACY_URLS.imageProfile}. Качество ограничено исходником старого сайта.`,
    { dryRun, group: 'media', summary },
  )

  const practiceAreaDocs = new Map<string, any>()

  for (const item of PRACTICE_AREAS) {
    const doc = await upsertBySlug(
      payload,
      'practice-areas',
      item.slug,
      {
        title: item.title,
        shortDescription: item.shortDescription,
        content: richTextParagraphs(item.content),
        iconLabel: item.iconLabel,
        order: item.order,
        showOnHome: true,
        sourceType: 'legacy-site',
        legacySourceUrl: LEGACY_URLS.home,
        legacySlug: item.slug,
        verified: true,
        verificationNote:
          'Направление сформировано по материалам старого сайта и подтвержденным темам публикаций/монографий.',
        _status: 'published',
      },
      { dryRun, group: 'practiceAreas', summary },
    )

    practiceAreaDocs.set(item.slug, doc)
  }

  for (const service of SERVICES) {
    await upsertBySlug(
      payload,
      'services',
      service.slug,
      {
        title: service.title,
        practiceAreas: service.practiceAreas.map((slug) => practiceAreaDocs.get(slug)?.id).filter(Boolean),
        shortDescription: service.shortDescription,
        content: richTextParagraphs(service.content),
        order: service.order,
        showOnHome: false,
        sourceType: 'editorial',
        legacySourceUrl: LEGACY_URLS.home,
        legacySlug: service.slug,
        verified: true,
        verificationNote: 'Редакционно адаптировано на основе подтвержденных практик старого сайта.',
        _status: 'published',
      },
      { dryRun, group: 'services', summary },
    )
  }

  const categoryIds = await ensureCategories(
    payload,
    ['Уголовный процесс', 'Профессиональная статья', 'Суд присяжных', 'Наркотические преступления'],
    { dryRun },
  )

  const academicEntries = splitNumberedEntries(
    extractMainText(
      LEGACY_URLS.academic,
      'Научные статьи, опубликованные в ведущих рецензируемых журналах и изданиях, рекомендованных Высшей аттестационной комиссией Министерства образования и науки Российской Федерации.',
    ),
  )

  const professionalEntries = splitNumberedEntries(
    extractMainText(
      LEGACY_URLS.professional,
      'Научные статьи, опубликованные в иных изданиях',
    ),
  )

  const publicationDocs: any[] = []
  let publicationIndex = 1

  for (const entry of academicEntries.slice(0, 12)) {
    const parsed = parsePublicationEntry(entry, 'academic')
    const slug = `academic-publication-${publicationIndex}`
    publicationIndex += 1

    const doc = await upsertBySlug(
      payload,
      'publications',
      slug,
      {
        title: parsed.title,
        authors: parsed.authors,
        source: parsed.source,
        type: parsed.type,
        issue: parsed.issue,
        pageRange: parsed.pageRange,
        description: parsed.description,
        publishedAt: parsed.year ? `${parsed.year}-01-01T00:00:00.000Z` : undefined,
        sourceType: 'legacy-site',
        legacySourceUrl: LEGACY_URLS.academic,
        legacySlug: slug,
        verified: true,
        verificationNote: 'Импортировано из авторской библиографии старого сайта.',
        meta: {
          title: parsed.title,
          description: parsed.description.slice(0, 150),
        },
        _status: publicationIndex <= 5 ? 'published' : 'draft',
      },
      { dryRun, group: 'publications', summary },
    )

    publicationDocs.push(doc)
  }

  for (const entry of professionalEntries.slice(0, 12)) {
    const parsed = parsePublicationEntry(entry, 'professional')
    const slug = `professional-publication-${publicationIndex}`
    publicationIndex += 1

    const doc = await upsertBySlug(
      payload,
      'publications',
      slug,
      {
        title: parsed.title,
        authors: parsed.authors,
        source: parsed.source,
        type: parsed.type,
        issue: parsed.issue,
        pageRange: parsed.pageRange,
        description: parsed.description,
        publishedAt: parsed.year ? `${parsed.year}-01-01T00:00:00.000Z` : undefined,
        sourceType: 'legacy-site',
        legacySourceUrl: LEGACY_URLS.professional,
        legacySlug: slug,
        verified: true,
        verificationNote: 'Импортировано из авторской библиографии старого сайта.',
        meta: {
          title: parsed.title,
          description: parsed.description.slice(0, 150),
        },
        _status: publicationIndex <= 9 ? 'published' : 'draft',
      },
      { dryRun, group: 'publications', summary },
    )

    publicationDocs.push(doc)
  }

  const legacyBooks = splitNumberedEntries(extractMainText(LEGACY_URLS.books, 'Монографии')).map(parseBookEntry)
  const bookDocs: any[] = []
  let bookIndex = 1

  for (const book of legacyBooks) {
    const slug = `legacy-book-${bookIndex}`
    bookIndex += 1

    const doc = await upsertBySlug(
      payload,
      'books',
      slug,
      {
        title: book.title,
        authors: book.authors,
        year: book.year,
        publisher: book.publisher,
        pageCount: book.pageCount,
        description: book.description,
        url: LEGACY_URLS.books,
        fullTextStatus: 'catalog-only',
        sourceType: 'legacy-site',
        legacySourceUrl: LEGACY_URLS.books,
        legacySlug: slug,
        verified: true,
        verificationNote: 'Библиографическая запись перенесена со старого авторского сайта.',
        _status: 'published',
      },
      { dryRun, group: 'books', summary },
    )

    bookDocs.push(doc)
  }

  for (const book of ADDITIONAL_BOOKS) {
    const doc = await upsertBySlug(
      payload,
      'books',
      book.slug,
      {
        title: book.title,
        authors: book.authors,
        year: book.year,
        publisher: book.publisher,
        pageCount: book.pageCount,
        isbn: book.isbn,
        description: book.description,
        url: book.url,
        fullTextStatus: book.fullTextStatus,
        sourceType: book.sourceType,
        legacySourceUrl: book.legacySourceUrl,
        legacySlug: book.slug,
        verified: book.verified,
        verificationNote: book.verificationNote,
        _status: book.publish ? 'published' : 'draft',
      },
      { dryRun, group: 'books', summary },
    )

    bookDocs.push(doc)
  }

  const postDocs = []

  for (const article of ARTICLE_CONFIG) {
    const extracted = extractStructuredParagraphs(article.url)

    const post = await upsertBySlug(
      payload,
      'posts',
      article.slug,
      {
        title: article.title,
        content: richTextParagraphs(extracted.paragraphs),
        excerpt: article.excerpt,
        authorName: 'Николай Павлович Ведищев',
        practiceAreas: article.practiceAreas.map((slug) => practiceAreaDocs.get(slug)?.id).filter(Boolean),
        categories: article.categories.map((title) => categoryIds.get(title)).filter(Boolean),
        publishedAt: article.publishedAt,
        sourceType: 'legacy-site',
        legacySourceUrl: article.url,
        legacySlug: article.slug,
        legacyPublishedAt: article.publishedAt,
        verified: true,
        verificationNote: 'Полный текст импортирован со старого сайта и очищен от служебной разметки.',
        meta: {
          title: article.title,
          description: article.seoDescription,
        },
        _status: 'published',
      },
      { dryRun, group: 'posts', summary },
    )

    postDocs.push(post)
  }

  for (const item of CASE_CONFIG) {
    const extracted = extractStructuredParagraphs(item.url)
    const paragraphs = extracted.paragraphs.filter((paragraph) => paragraph !== item.title)
    const lead = paragraphs.slice(0, 4)
    const resultParagraphs = paragraphs.filter((paragraph) => /отмен|жалоб|пересмотр|определил|постановил/i.test(paragraph)).slice(0, 4)

    await upsertBySlug(
      payload,
      'cases',
      item.slug,
      {
        title: item.title,
        practiceArea: practiceAreaDocs.get(item.practiceArea)?.id,
        shortDescription: item.shortDescription,
        caseCategory: item.practiceArea === 'jury-trials' ? 'Суд присяжных' : 'Пересмотр судебных актов',
        decisionDate: item.year ? `${item.year}-01-01T00:00:00.000Z` : undefined,
        situation: richTextParagraphs(lead),
        proceduralIssue: item.proceduralIssue,
        advocateWork: richTextParagraphs([
          'На старом сайте материал опубликован как пример реальной адвокатской работы и судебного пересмотра.',
          'Для production-карточки кейса требуется дополнительная редактура и отдельная проверка допустимого объема персональных данных.',
        ]),
        result: richTextParagraphs(resultParagraphs.length ? resultParagraphs : lead.slice(0, 2)),
        year: item.year,
        showOnHome: false,
        sourceType: 'legacy-site',
        legacySourceUrl: item.url,
        legacySlug: item.slug,
        verified: false,
        verificationNote:
          'Текст загружен со старого сайта; перед публикацией требуется ручная проверка анонимизации и редактура summary.',
        meta: {
          title: item.title,
          description: item.shortDescription,
        },
        _status: 'draft',
      },
      { dryRun, group: 'cases', summary },
    )
  }

  for (const item of VIDEO_CONFIG) {
    await upsertBySlug(
      payload,
      'videos',
      item.slug,
      {
        title: item.title,
        provider: 'other',
        description: item.description,
        externalURL: item.url,
        sourceType: 'legacy-site',
        legacySourceUrl: item.url,
        legacySlug: item.slug,
        verified: true,
        verificationNote: 'Короткий legacy-видеоматериал старого сайта.',
        _status: 'draft',
      },
      { dryRun, group: 'videos', summary },
    )
  }

  const currentSiteSettings = await payload.findGlobal({
    slug: 'site-settings',
  })

  await upsertGlobal(
    payload,
    'site-settings',
    {
      fullName: 'Николай Павлович Ведищев',
      professionalStatus: 'Адвокат, кандидат юридических наук',
      phone: placeholderOrEmpty(currentSiteSettings?.phone, [/000-00-00/, /^\+7 \(000\)/]),
      email: placeholderOrEmpty(currentSiteSettings?.email, [/^hello@vedishev\.ru$/i]),
      address: placeholderOrEmpty(currentSiteSettings?.address, [/будет подтвержден/i, /публикуются после подтверждения/i]),
      workingHours: '',
      telegram: '',
      whatsApp: '',
      advocateDetails:
        'Реестровый номер 77/1988. Московская городская коллегия адвокатов, Адвокатская контора №39 «Академическая». Исторические контакты со старого сайта вынесены в отдельную проверку.',
      consultationDisclaimer:
        'Контактные данные из формы используются только для обратной связи по вопросу консультации. Исторические контакты старого сайта не публикуются без подтверждения.',
      heroPortrait: heroPortrait.id,
      profilePortrait: profilePortrait.id,
      primaryCTA: {
        link: {
          type: 'custom',
          url: '#consultation',
          label: 'Записаться на консультацию',
          appearance: 'default',
        },
      },
      footerNote:
        'Материалы сайта основаны на подтвержденных биографических и авторских источниках. Legacy-контакты и спорные факты проходят отдельную проверку.',
      legalLinks: [
        {
          label: 'Политика конфиденциальности',
          url: '/privacy',
        },
      ],
    },
    { dryRun },
  )

  await upsertGlobal(
    payload,
    'header',
    {
      navItems: [
        { link: { type: 'custom', url: '/', label: 'Главная' } },
        { link: { type: 'custom', url: '/#about', label: 'Об адвокате' } },
        { link: { type: 'custom', url: '/#practice', label: 'Практика' } },
        { link: { type: 'custom', url: '/#publications', label: 'Публикации' } },
        { link: { type: 'custom', url: '/#books', label: 'Книги' } },
        { link: { type: 'custom', url: '/posts', label: 'Статьи' } },
      ],
    },
    { dryRun },
  )

  await upsertGlobal(
    payload,
    'footer',
    {
      navItems: [
        { link: { type: 'custom', url: '/', label: 'Главная' } },
        { link: { type: 'custom', url: '/#practice', label: 'Практика' } },
        { link: { type: 'custom', url: '/#publications', label: 'Публикации' } },
        { link: { type: 'custom', url: '/#books', label: 'Книги' } },
        { link: { type: 'custom', url: '/posts', label: 'Статьи' } },
      ],
    },
    { dryRun },
  )

  await upsertBySlug(
    payload,
    'pages',
    'home',
    {
      title: 'Главная',
      layout: [
        {
          blockType: 'legalHero',
          eyebrow: 'Адвокат по уголовным делам',
          heading: 'Николай Павлович\nВедищев',
          lead:
            'Адвокат, кандидат юридических наук, член МГКА. В адвокатуре с 1993 года, с устойчивой уголовно-правовой специализацией и заметной научной работой.',
          primaryLink: {
            link: {
              type: 'custom',
              url: '#consultation',
              label: 'Записаться на консультацию',
              appearance: 'default',
            },
          },
          secondaryLink: {
            link: {
              type: 'custom',
              url: '#practice',
              label: 'Направления практики',
              appearance: 'outline',
            },
          },
          portraitPlaceholder:
            'Используется подтвержденная историческая фотография старого сайта. При наличии более современного исходника портрет можно заменить без смены композиции.',
        },
        {
          blockType: 'trustStrip',
          items: [
            {
              title: 'Реестр 77/1988',
              description: 'Проверено по официальному профилю в Московской городской коллегии адвокатов.',
            },
            {
              title: 'В адвокатуре с 1993 года',
              description: 'Профессиональная практика подтверждена официальным профилем МГКА.',
            },
            {
              title: 'Кандидат юридических наук',
              description: 'Степень подтверждается историческим сайтом и официальным адвокатским профилем.',
            },
            {
              title: 'АК №39 «Академическая»',
              description: 'Ключевая институциональная привязка, используемая как часть профессионального позиционирования.',
            },
          ],
        },
        {
          blockType: 'practiceGrid',
          eyebrow: 'Адвокатская практика',
          heading: 'Основные направления работы',
          description:
            'Направления собраны по реальным публикациям, монографиям и материалам старого сайта. Без искусственного расширения практики ради заполнения сетки.',
          areas: [...practiceAreaDocs.values()].map((item) => item.id),
          inlineFormTitle: 'Нужна профессиональная оценка ситуации?',
        },
        {
          blockType: 'aboutProfile',
          eyebrow: 'Об адвокате',
          heading: 'Профессиональная биография',
          description:
            'На сайте используется не рекламная легенда, а выверенная биографическая версия, построенная на старом авторском сайте и официальных источниках.',
          content: richTextParagraphs([
            'Николай Павлович Ведищев родился 11 июня 1954 года в Москве. В 1980 году окончил дневное отделение юридического факультета Ивановского государственного университета.',
            'После университета работал в органах прокуратуры Москвы. С 1993 года занимается адвокатской деятельностью, связан с Московской городской коллегией адвокатов и Адвокатской конторой №39 «Академическая».',
            'Сфера профессионального интереса сочетает уголовно-правовую защиту, пересмотр судебных ошибок, суд присяжных и научную работу по вопросам уголовного процесса.',
          ]),
          highlights: [
            {
              title: 'Образование',
              description: 'Юридический факультет Ивановского государственного университета, выпуск 1980 года.',
            },
            {
              title: 'Прокуратура Москвы',
              description: 'Историческая часть профессионального пути до перехода в адвокатуру.',
            },
            {
              title: 'Адвокатская практика с 1993 года',
              description: 'Факт подтвержден официальным профилем Московской городской коллегии адвокатов.',
            },
            {
              title: 'Научная работа и книги',
              description: 'Отдельный пласт профессионального позиционирования, подтвержденный legacy-сайтом и каталогами.',
            },
          ],
          profileLink: {
            link: {
              type: 'custom',
              url: '/#books',
              label: 'Книги и научные работы',
              appearance: 'default',
            },
          },
        },
        {
          blockType: 'publicationsList',
          eyebrow: 'Публикации',
          heading: 'Научные и профессиональные публикации',
          description:
            'Библиография собрана из авторского архива старого сайта и переведена в управляемую структуру CMS.',
          publications: publicationDocs.slice(0, 4).map((item) => item.id),
        },
        {
          blockType: 'articlesGrid',
          eyebrow: 'Статьи',
          heading: 'Авторские материалы',
          description:
            'Полнотекстовые статьи сохраняют авторский характер и опубликованы без рекламной переписи, только после очистки legacy-разметки.',
          articles: postDocs.map((item) => item.id),
        },
        {
          blockType: 'booksShowcase',
          eyebrow: 'Книги и научные работы',
          heading: 'Книги и научные работы',
          description:
            'Книги и монографии подтверждают глубину специализации и научного интереса к судебным ошибкам, суду присяжных и уголовному процессу.',
          books: bookDocs.slice(0, 6).map((item) => item.id),
        },
      ],
      meta: {
        title: 'Николай Павлович Ведищев',
        description:
          'Персональный сайт адвоката Николая Павловича Ведищева: уголовно-правовая практика, научные публикации, книги и авторские статьи.',
      },
      publishedAt: new Date().toISOString(),
      _status: 'published',
    },
    { dryRun, group: 'homepage', summary },
  )

  await upsertBySlug(
    payload,
    'pages',
    'privacy',
    {
      title: 'Политика конфиденциальности',
      layout: [
        {
          blockType: 'contactsBlock',
          heading: 'Политика конфиденциальности будет опубликована после подготовки финального текста',
          description:
            'На этапе миграции контента страница сохранена в production как техническая заглушка и может быть заполнена через Payload CMS.',
        },
      ],
      _status: 'published',
    },
    { dryRun },
  )

  if (dryRun) {
    await writeDryRunReport(reportPath, summary)
  }

  console.log(
    JSON.stringify(
      {
        mode: dryRun ? 'dry-run' : 'write',
        reportPath: dryRun ? reportPath : null,
        operations: summary,
        imported: {
          practiceAreas: PRACTICE_AREAS.length,
          services: SERVICES.length,
          publications: publicationDocs.length,
          books: bookDocs.length,
          posts: postDocs.length,
          cases: CASE_CONFIG.length,
          videos: VIDEO_CONFIG.length,
          media: 2,
          homepage: 1,
        },
        featured: {
          publications: publicationDocs.slice(0, 4).length,
          books: bookDocs.slice(0, 6).length,
          posts: postDocs.length,
        },
      },
      null,
      2,
    ),
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => {
    if (payloadInstance?.destroy) {
      void payloadInstance.destroy().catch((error) => {
        console.error(error)
        process.exitCode = 1
      })
    }

    // This is a one-off migration utility, so terminate even if upstream libraries keep handles open.
    setTimeout(() => {
      process.exit(process.exitCode ?? 0)
    }, 0)
  })
