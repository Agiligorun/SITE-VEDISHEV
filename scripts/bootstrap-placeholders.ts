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
      address: 'Адрес офиса будет подтвержден через CMS',
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
      shortDescription: 'Защита на всех стадиях уголовного процесса по делам любой сложности.',
      iconLabel: 'УД',
      order: 1,
      showOnHome: true,
      _status: 'published',
    }),
    upsertBySlug(payload, 'practice-areas', 'civil-disputes', {
      title: 'Гражданские дела',
      shortDescription: 'Представительство в судах по гражданским спорам и конфликтам.',
      iconLabel: 'ГД',
      order: 2,
      showOnHome: true,
      _status: 'published',
    }),
    upsertBySlug(payload, 'practice-areas', 'arbitration', {
      title: 'Арбитражные споры',
      shortDescription: 'Защита интересов бизнеса в арбитражных судах и переговорах.',
      iconLabel: 'АС',
      order: 3,
      showOnHome: true,
      _status: 'published',
    }),
    upsertBySlug(payload, 'practice-areas', 'family-law', {
      title: 'Семейные споры',
      shortDescription: 'Деликатное сопровождение в семейных конфликтах и переговорах.',
      iconLabel: 'СД',
      order: 4,
      showOnHome: true,
      _status: 'published',
    }),
    upsertBySlug(payload, 'practice-areas', 'inheritance-law', {
      title: 'Наследственные дела',
      shortDescription: 'Оформление наследства, споры о наследовании и восстановление сроков.',
      iconLabel: 'НД',
      order: 5,
      showOnHome: true,
      _status: 'published',
    }),
    upsertBySlug(payload, 'practice-areas', 'housing-disputes', {
      title: 'Жилищные споры',
      shortDescription: 'Споры о праве пользования, вселении, выселении и признании права собственности.',
      iconLabel: 'ЖС',
      order: 6,
      showOnHome: true,
      _status: 'published',
    }),
    upsertBySlug(payload, 'practice-areas', 'administrative-cases', {
      title: 'Административные дела',
      shortDescription: 'Обжалование действий органов власти и должностных лиц.',
      iconLabel: 'АД',
      order: 7,
      showOnHome: true,
      _status: 'published',
    }),
    upsertBySlug(payload, 'practice-areas', 'international-cases', {
      title: 'Международные дела',
      shortDescription: 'Правовая помощь в делах с иностранным элементом и трансграничными рисками.',
      iconLabel: 'МД',
      order: 8,
      showOnHome: true,
      _status: 'published',
    }),
  ])

  const publications = await Promise.all([
    upsertBySlug(payload, 'publications', 'publication-1', {
      title: 'Комментарий по правовым вопросам публикуется после проверки источников',
      source: 'Коммерсантъ',
      description: 'Структура блока уже соответствует будущим публикациям в СМИ.',
      type: 'media',
      publishedAt: '2026-03-20T10:00:00.000Z',
      _status: 'published',
    }),
    upsertBySlug(payload, 'publications', 'publication-2', {
      title: 'Научные и экспертные материалы будут подключены через CMS',
      source: 'Российская газета',
      description: 'Секция подготовлена для реальных публикаций без редизайна.',
      type: 'academic',
      publishedAt: '2026-04-15T10:00:00.000Z',
      _status: 'published',
    }),
    upsertBySlug(payload, 'publications', 'publication-3', {
      title: 'Интервью и комментарии будут опубликованы после верификации',
      source: 'Право.ru',
      description: 'После замены placeholder-контента блок сохранит ту же геометрию.',
      type: 'interview',
      publishedAt: '2026-04-02T10:00:00.000Z',
      _status: 'published',
    }),
  ])

  const posts = await Promise.all([
    upsertBySlug(payload, 'posts', 'article-legal-risk', {
      title: 'Что делать при первом разговоре с адвокатом',
      content: richText('Материал-заполнитель для демонстрации карточек статей до публикации реального редакционного контента.'),
      meta: {
        description: 'Практические ориентиры для первого контакта и подготовки к делу.',
      },
      publishedAt: '2026-03-20T10:00:00.000Z',
      _status: 'published',
    }),
    upsertBySlug(payload, 'posts', 'article-case-strategy', {
      title: 'Как оспорить отказ в принятии наследства',
      content: richText('Текст статьи будет заменен реальным материалом после подготовки и проверки фактов.'),
      meta: {
        description: 'Пошаговая инструкция по восстановлению срока и защите наследственных прав.',
      },
      publishedAt: '2026-04-15T10:00:00.000Z',
      _status: 'published',
    }),
    upsertBySlug(payload, 'posts', 'article-consultation', {
      title: 'Новые изменения в жилищном законодательстве 2026 года',
      content: richText('Черновой контент поддерживает визуальную структуру homepage и дальнейшее тестирование publish flow.'),
      meta: {
        description: 'Обзор ключевых изменений и их влияние на собственников и нанимателей жилья.',
      },
      publishedAt: '2026-04-02T10:00:00.000Z',
      _status: 'published',
    }),
    upsertBySlug(payload, 'posts', 'article-process', {
      title: 'На что обратить внимание при заключении договора',
      content: richText('Временный текст нужен только для production-bootstrap и проверки отображения карточек.'),
      meta: {
        description: 'Основные риски и способы их минимизации при подписании документов.',
      },
      publishedAt: '2026-03-28T10:00:00.000Z',
      _status: 'published',
    }),
  ])

  const homeData = {
    title: 'Главная',
    layout: [
      {
        blockType: 'legalHero',
        heading: 'Профессиональная юридическая защита\nВаших прав и интересов',
        eyebrow: 'Персональная практика',
        lead: 'Более 20 лет успешной адвокатской практики в сложных и нестандартных делах.',
        primaryLink: {
          link: {
            type: 'custom',
            url: '#consultation',
            label: 'Получить консультацию',
            appearance: 'default',
          },
        },
        secondaryLink: null,
        portraitPlaceholder:
          'Placeholder занимает ту же геометрию, что и будущая portrait-фотография в hero.',
      },
      {
        blockType: 'trustStrip',
        items: [
          {
            title: 'Опыт',
            description: 'Более 20 лет успешной адвокатской практики',
          },
          {
            title: 'Индивидуальный подход',
            description: 'Решения, основанные на анализе вашей ситуации',
          },
          {
            title: 'Конфиденциальность',
            description: 'Гарантия полной конфиденциальности',
          },
        ],
      },
      {
        blockType: 'practiceGrid',
        eyebrow: 'Адвокатская практика',
        heading: 'Адвокатская практика',
        description: 'Основные направления частной практики и сопровождения доверителей.',
        areas: practiceAreas.map((area) => area.id),
        inlineFormTitle: 'Нужна помощь адвоката?',
      },
      {
        blockType: 'aboutProfile',
        eyebrow: 'Об адвокате',
        heading: 'Об адвокате',
        description: 'Блок остается компактным и будет наполнен подтвержденной профессиональной биографией.',
        content: richText('Здесь будет размещена краткая профессиональная биография, подготовленная для доверительного первого контакта и последующего изучения профиля через CMS.'),
        profileLink: {
          link: {
            type: 'custom',
            url: '/#contacts',
            label: 'Подробнее обо мне',
            appearance: 'default',
          },
        },
      },
      {
        blockType: 'publicationsList',
        eyebrow: 'Публикации',
        heading: 'Публикации в СМИ',
        publications: publications.map((item) => item.id),
      },
      {
        blockType: 'articlesGrid',
        eyebrow: 'Статьи',
        heading: 'Статьи',
        description: 'Подборка материалов для проверки итоговой геометрии и редакционного ритма блока.',
        articles: posts.map((post) => post.id),
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
