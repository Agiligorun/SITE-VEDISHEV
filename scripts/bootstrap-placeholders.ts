// @ts-nocheck
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const richText = (text: string) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
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
      },
    ],
  },
})

async function upsertBySlug<T extends string>(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: T,
  slug: string,
  data: Record<string, unknown>,
) {
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

  if (existing.docs[0]) {
    return payload.update({
      collection,
      id: existing.docs[0].id,
      data,
    })
  }

  return payload.create({
    collection,
    data: {
      ...data,
      slug,
    },
  })
}

async function main() {
  const payload = await getPayload({ config: configPromise })

  const siteSettings = await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      fullName: 'Николай Павлович Ведищев',
      professionalStatus: 'Адвокат',
      phone: '+7 (000) 000-00-00',
      email: 'hello@vedishev.ru',
      address: 'Адрес будет подтвержден и заполнен через CMS',
      workingHours: 'По предварительной записи',
      advocateDetails: 'Данные адвокатского образования и юридические реквизиты заполняются после верификации источников.',
      consultationDisclaimer:
        'Отправляя форму, вы передаете контактные данные для обратной связи по вопросу консультации.',
      primaryCTA: {
        link: {
          type: 'custom',
          url: '#consultation',
          label: 'Записаться на консультацию',
          appearance: 'default',
        },
      },
      footerNote:
        'Содержимое сайта находится на этапе P1 bootstrap и будет наполняться подтвержденными материалами через Payload CMS.',
      legalLinks: [
        {
          label: 'Политика конфиденциальности',
          url: '/privacy',
        },
      ],
    },
  })

  let homePageId: number | null = null
  const homePageExisting = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  if (homePageExisting.docs[0]) {
    homePageId = homePageExisting.docs[0].id
  }

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            url: '/',
            label: 'Главная',
          },
        },
        {
          link: {
            type: 'custom',
            url: '/#about',
            label: 'Об адвокате',
          },
        },
        {
          link: {
            type: 'custom',
            url: '/#practice',
            label: 'Адвокатская практика',
          },
        },
        {
          link: {
            type: 'custom',
            url: '/#publications',
            label: 'Публикации',
          },
        },
        {
          link: {
            type: 'custom',
            url: '/posts',
            label: 'Статьи',
          },
        },
        {
          link: {
            type: 'custom',
            url: '/#contacts',
            label: 'Контакты',
          },
        },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      navItems: [
        {
          link: {
            type: 'custom',
            url: '/',
            label: 'Главная',
          },
        },
        {
          link: {
            type: 'custom',
            url: '/#practice',
            label: 'Практика',
          },
        },
        {
          link: {
            type: 'custom',
            url: '/posts',
            label: 'Статьи',
          },
        },
      ],
    },
  })

  const practiceAreas = await Promise.all([
    upsertBySlug(payload, 'practice-areas', 'criminal-law', {
      title: 'Уголовные дела',
      shortDescription: 'Защита по сложным и чувствительным уголовно-правовым вопросам.',
      iconLabel: 'УД',
      order: 1,
      showOnHome: true,
      _status: 'published',
    }),
    upsertBySlug(payload, 'practice-areas', 'civil-disputes', {
      title: 'Гражданские споры',
      shortDescription: 'Индивидуальная правовая стратегия в частных и имущественных конфликтах.',
      iconLabel: 'ГД',
      order: 2,
      showOnHome: true,
      _status: 'published',
    }),
    upsertBySlug(payload, 'practice-areas', 'arbitration', {
      title: 'Арбитражные споры',
      shortDescription: 'Сопровождение корпоративных и коммерческих споров в арбитражной юрисдикции.',
      iconLabel: 'АС',
      order: 3,
      showOnHome: true,
      _status: 'published',
    }),
    upsertBySlug(payload, 'practice-areas', 'family-law', {
      title: 'Семейные споры',
      shortDescription: 'Конфиденциальная правовая помощь в деликатных семейных вопросах.',
      iconLabel: 'СД',
      order: 4,
      showOnHome: true,
      _status: 'published',
    }),
  ])

  const publications = await Promise.all([
    upsertBySlug(payload, 'publications', 'publication-1', {
      title: 'Комментарий по правовым вопросам публикуется после проверки источников',
      source: 'Федеральные и отраслевые медиа',
      description: 'Блок оставляет структуру публикаций в дизайне и ожидает подтвержденные материалы.',
      type: 'media',
      _status: 'published',
    }),
    upsertBySlug(payload, 'publications', 'publication-2', {
      title: 'Научные и экспертные материалы будут подключены через CMS',
      source: 'Профессиональные издания',
      description: 'Секция уже готова для наполнения реальными публикациями без изменения дизайна.',
      type: 'academic',
      _status: 'published',
    }),
    upsertBySlug(payload, 'publications', 'publication-3', {
      title: 'Интервью и комментарии будут опубликованы после верификации',
      source: 'Медиа и юридические платформы',
      description: 'На этапе P1 сохраняем визуальную механику и структуру reference.',
      type: 'interview',
      _status: 'published',
    }),
  ])

  const posts = await Promise.all([
    upsertBySlug(payload, 'posts', 'article-legal-risk', {
      title: 'На что обратить внимание при первом разговоре с адвокатом',
      content: richText('Материал-заполнитель для демонстрации карточек статей до публикации реального редакционного контента.'),
      meta: {
        description: 'Карточка статьи показывает итоговый визуальный шаблон секции.',
      },
      publishedAt: new Date().toISOString(),
      _status: 'published',
    }),
    upsertBySlug(payload, 'posts', 'article-case-strategy', {
      title: 'Как структурировать правовую стратегию на раннем этапе спора',
      content: richText('Текст статьи будет заменен реальным материалом после подготовки и проверки фактов.'),
      meta: {
        description: 'Пока это демонстрационный материал, необходимый для проверки homepage и CMS-потока.',
      },
      publishedAt: new Date().toISOString(),
      _status: 'published',
    }),
    upsertBySlug(payload, 'posts', 'article-consultation', {
      title: 'Почему первичная консультация должна быть спокойной и предметной',
      content: richText('Черновой контент поддерживает визуальную структуру homepage и дальнейшее тестирование publish flow.'),
      meta: {
        description: 'Материал нужен для P1 и будет заменен через редакционный workflow в Payload.',
      },
      publishedAt: new Date().toISOString(),
      _status: 'published',
    }),
    upsertBySlug(payload, 'posts', 'article-process', {
      title: 'Как подготовиться к обсуждению сложного правового вопроса',
      content: richText('Временный текст нужен только для production-bootstrap и проверки отображения карточек.'),
      meta: {
        description: 'После P1 секция заполнится реальными статьями через CMS.',
      },
      publishedAt: new Date().toISOString(),
      _status: 'published',
    }),
  ])

  const homeData = {
    title: 'Главная',
    layout: [
      {
        blockType: 'legalHero',
        heading: 'Персональная юридическая защита с акцентом на статус, спокойствие и доверие',
        eyebrow: 'Персональная практика',
        lead: 'Desktop-главная уже воспроизводит дизайн-язык референса и остается готовой к дальнейшему наполнению через Payload CMS.',
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
            label: 'Посмотреть направления',
            appearance: 'outline',
          },
        },
        portraitPlaceholder:
          'До загрузки подтвержденной фотографии в CMS используется честный placeholder без выдуманного production-портрета.',
      },
      {
        blockType: 'trustStrip',
        items: [
          {
            title: 'Индивидуальный подход',
            description: 'Каждое обращение рассматривается как отдельная стратегия, а не как типовой поток.',
          },
          {
            title: 'Конфиденциальность',
            description: 'Коммуникация и обработка обращений строятся без агрессивных маркетинговых сценариев.',
          },
          {
            title: 'Профессиональная специализация',
            description: 'Структура сайта готова к публикации подтвержденных практик и материалов.',
          },
          {
            title: 'Современный workflow',
            description: 'Контент, черновики, публикации и заявки уже управляются через Payload CMS.',
          },
        ],
      },
      {
        blockType: 'practiceGrid',
        eyebrow: 'Адвокатская практика',
        heading: 'Ключевые направления практики',
        description: 'Сетка сохраняет механику reference и остается управляемой через отношения Payload CMS.',
        areas: practiceAreas.map((area) => area.id),
        inlineFormTitle: 'Нужна помощь адвоката?',
      },
      {
        blockType: 'aboutProfile',
        eyebrow: 'Об адвокате',
        heading: 'Персональный формат работы и аккуратная подача без шаблонного фирменного тона',
        description: 'На этапе P1 биографический блок остается компактным и готов к наполнению подтвержденными данными.',
        content: richText('Здесь размещается краткая профессиональная биография, подготовленная для доверительного первого контакта и дальнейшего изучения профиля через CMS.'),
        highlights: [
          {
            title: 'Персональная ответственность',
            description: 'Секция поддерживает ощущение частной практики, а не массового юридического конвейера.',
          },
          {
            title: 'Структурная ясность',
            description: 'Homepage уже повторяет reference-композицию и готова к уточнению контента без редизайна.',
          },
        ],
        profileLink: {
          link: {
            type: 'custom',
            url: '/#contacts',
            label: 'Подробнее',
            appearance: 'default',
          },
        },
      },
      {
        blockType: 'publicationsList',
        eyebrow: 'Публикации',
        heading: 'Публикации и экспертные комментарии',
        description: 'Секция уже развернута в нужной визуальной логике и ждет реальных материалов.',
        publications: publications.map((item) => item.id),
      },
      {
        blockType: 'articlesGrid',
        eyebrow: 'Статьи',
        heading: 'Актуальные материалы',
        description: 'Карточки статей уже подключены к Payload и проходят полный draft/publish workflow.',
        articles: posts.map((post) => post.id),
      },
      {
        blockType: 'faqBlock',
        eyebrow: 'FAQ',
        heading: 'Частые вопросы',
        description: 'Здесь останется компактный блок с ответами, который легко поддерживать через CMS.',
        items: [
          {
            question: 'Можно ли редактировать структуру homepage без изменения дизайна?',
            answer: richText('Да. Контентные блоки управляются через Payload CMS, а композиция секций остается зафиксированной в коде.'),
          },
          {
            question: 'Что уже работает на этапе P1?',
            answer: richText('Шаблон homepage, коллекции Payload, черновики и публикация страниц и статей, а также форма консультации с сохранением заявок.'),
          },
        ],
      },
      {
        blockType: 'consultationCta',
        eyebrow: 'Консультация',
        heading: 'Оставьте обращение',
        description: 'Форма сохраняет заявки в Payload и уже пригодна для production-проверки.',
        formTitle: 'Записаться на консультацию',
      },
      {
        blockType: 'contactsBlock',
        eyebrow: 'Контакты',
        heading: 'Контактная информация',
        description: 'Контактный блок завершает страницу в том же design-языке, что и reference.',
      },
    ],
    meta: {
      title: 'Главная',
      description: 'P1 bootstrap главной страницы vedishev.ru с design reference как source of truth.',
    },
    publishedAt: new Date().toISOString(),
    _status: 'published',
  }

  if (homePageId) {
    await payload.update({
      collection: 'pages',
      id: homePageId,
      data: homeData,
    })
  } else {
    const homePage = await payload.create({
      collection: 'pages',
      data: {
        ...homeData,
        slug: 'home',
      },
    })
    homePageId = homePage.id
  }

  await upsertBySlug(payload, 'pages', 'privacy', {
    title: 'Политика конфиденциальности',
    layout: [
      {
        blockType: 'contactsBlock',
        heading: 'Политика конфиденциальности будет опубликована после подготовки финального текста',
        description: 'На этапе P1 страница сохранена как placeholder и может быть заполнена через Payload CMS.',
      },
    ],
    _status: 'published',
  })

  console.log('Bootstrap complete', {
    homePageId,
    siteSettingsId: siteSettings.id,
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
