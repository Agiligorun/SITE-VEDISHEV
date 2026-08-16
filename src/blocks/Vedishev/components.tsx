import type { Config } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  FileText,
  Gavel,
  Handshake,
  Landmark,
  Scale,
  ScrollText,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { ConsultationForm } from './ConsultationForm'

type SiteSettings = Config['globals']['site-settings']
type MediaResource = Config['collections']['media']

const resolveMedia = (value: unknown): MediaResource | null => {
  if (typeof value === 'object' && value !== null && 'url' in value) {
    return value as MediaResource
  }

  return null
}

const practiceIcons = [
  Scale,
  ScrollText,
  Landmark,
  Users,
  BriefcaseBusiness,
  Building2,
  Gavel,
  FileText,
]

const trustIcons = [Handshake, ShieldCheck, Scale]

const sectionTitle = (eyebrow?: string | null, heading?: string | null, description?: string | null) => (
  <div className="mb-6 flex items-end justify-between gap-6">
    <div className="max-w-[46rem]">
      {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
      {heading ? <h2 className="section-heading text-primary">{heading}</h2> : null}
      {description ? <p className="mt-3 max-w-[42rem] text-[0.95rem] leading-7 text-muted-foreground">{description}</p> : null}
    </div>
  </div>
)

const renderHeroHeading = (heading?: string | null) => {
  if (!heading) return null

  const lines = heading
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length <= 1) {
    return heading
  }

  return (
    <>
      {lines.slice(0, -1).map((line) => (
        <span className="block" key={line}>
          {line}
        </span>
      ))}
      <span className="block text-accent">{lines.at(-1)}</span>
    </>
  )
}

const buildPracticeItems = (areas: any[] = []) =>
  areas
    .filter((area) => area?.title && area?.shortDescription)
    .map((area) => ({
      iconLabel: area?.iconLabel || String(area.title).slice(0, 2).toUpperCase(),
      shortDescription: area.shortDescription,
      title: area.title,
    }))

const buildTrustItems = (items: any[] = []) =>
  items
    .filter((item) => item?.title && item?.description)
    .map((item) => ({
      description: item.description,
      title: item.title,
    }))

const PlaceholderPhoto = ({
  dark = false,
  title,
  description,
}: {
  dark?: boolean
  title: string
  description: string
}) => (
  <div
    className={
      dark
        ? 'relative flex h-full min-h-[420px] flex-col justify-between overflow-hidden bg-[linear-gradient(115deg,#566173_0%,#bdb09d_45%,#e7dfd4_100%)] p-7 text-white'
        : 'relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#ddd4c8_0%,#f5efe6_100%)] p-6 text-primary'
    }
  >
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
    <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_24px,rgba(255,255,255,0.11)_24px,rgba(255,255,255,0.11)_48px)]" />
    <span className="relative z-10 inline-flex max-w-max border border-white/35 bg-white/58 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
      Photo placeholder
    </span>
    <div className="relative z-10 max-w-[16rem] bg-white/84 p-5 text-primary">
      <p className="font-serif text-[1.9rem] leading-[1.05]">{title}</p>
      <p className="mt-3 text-[0.9rem] leading-6 text-primary/72">{description}</p>
    </div>
  </div>
)

const PracticeCard = ({ area, index }: { area: any; index: number }) => {
  const Icon = practiceIcons[index % practiceIcons.length]

  return (
    <article className="flex h-full flex-col border border-border bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center border border-accent/55 text-accent">
        <Icon className="size-[1.05rem] stroke-[1.6]" />
      </div>
      <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.15] text-primary">{area.title}</h3>
      <p className="mt-3 flex-1 text-[0.92rem] leading-6 text-muted-foreground">{area.shortDescription}</p>
    </article>
  )
}

function AboutColumn({
  block,
  siteSettings,
}: {
  block: any
  siteSettings?: SiteSettings
}) {
  const profilePortrait = resolveMedia(siteSettings?.profilePortrait)

  return (
    <div id="about">
      <p className="section-kicker">{block.eyebrow || 'Об адвокате'}</p>
      <div className="grid gap-5 md:grid-cols-[10rem_minmax(0,1fr)]">
        <div className="border border-border bg-white">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#e4ddd3]">
            {profilePortrait ? (
              <Media
                fill
                imgClassName="h-full w-full object-cover"
                pictureClassName="block h-full w-full"
                resource={profilePortrait}
                size="(max-width: 1024px) 100vw, 180px"
              />
            ) : (
              <PlaceholderPhoto
                title="Портрет"
                description="Подтвержденная фотография будет добавлена позже, но геометрия блока уже соответствует макету."
              />
            )}
          </div>
        </div>

        <div>
          <p className="font-serif text-[2rem] leading-[1.08] text-primary">
            {siteSettings?.fullName || 'Николай Павлович Ведищев'}
          </p>
          {siteSettings?.professionalStatus ? <p className="mt-2 text-[0.95rem] text-primary/72">{siteSettings.professionalStatus}</p> : null}
          {block.description ? (
            <p className="mt-6 text-[0.95rem] leading-7 text-muted-foreground">{block.description}</p>
          ) : null}
          {block.content ? (
            <RichText
              className="mt-5 space-y-4 text-[0.95rem] leading-7 text-muted-foreground"
              data={block.content}
              enableGutter={false}
              enableProse={false}
            />
          ) : null}
          {block.highlights?.length ? (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {block.highlights.map((item: any, index: number) => (
                <div className="border border-border/80 bg-[#f6f1ea] px-4 py-4" key={item?.title || index}>
                  <p className="font-serif text-[1.05rem] leading-[1.15] text-primary">{item?.title}</p>
                  {item?.description ? (
                    <p className="mt-2 text-[0.88rem] leading-6 text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {block.profileLink?.link ? (
            <CMSLink
              {...block.profileLink.link}
              appearance="inline"
              className="gold-button mt-6 inline-flex min-w-[12rem] justify-center no-underline"
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

function PublicationsColumn({ block }: { block: any }) {
  return (
    <div id="publications">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">{block.eyebrow || 'Публикации'}</p>
          <h2 className="font-serif text-[2rem] leading-[1.08] text-primary">
            {block.heading || 'Публикации в СМИ'}
          </h2>
        </div>
        <a className="inline-flex items-center gap-2 text-[0.88rem] text-primary transition-opacity hover:opacity-70" href="#publications">
          Все публикации
          <ArrowRight className="size-4 stroke-[1.7]" />
        </a>
      </div>

      <div className="mt-6 border border-border bg-white">
        {block.publications?.map((publication: any, index: number) => (
          <article
            className="grid gap-4 border-b border-border px-6 py-5 last:border-b-0 md:grid-cols-[10.5rem_minmax(0,1fr)]"
            key={publication?.id || index}
          >
            <div className="flex items-center text-[1.1rem] font-medium text-primary/72">{publication?.source}</div>
            <div>
              <h3 className="font-serif text-[1.28rem] leading-[1.25] text-primary">{publication?.title}</h3>
              {publication?.description ? (
                <p className="mt-2 text-[0.9rem] leading-6 text-muted-foreground">{publication.description}</p>
              ) : null}
              {publication?.publishedAt ? (
                <p className="mt-2 text-[0.86rem] text-muted-foreground">
                  {new Date(publication.publishedAt).toLocaleDateString('ru-RU')}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export function HomeAboutPublicationsZone({
  aboutBlock,
  publicationsBlock,
  siteSettings,
}: {
  aboutBlock: any
  publicationsBlock: any
  siteSettings?: SiteSettings
}) {
  return (
    <section className="container py-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-start">
        <AboutColumn block={aboutBlock} siteSettings={siteSettings} />
        <PublicationsColumn block={publicationsBlock} />
      </div>
    </section>
  )
}

export function HeroBlock(props: any) {
  const { eyebrow, heading, lead, primaryLink, portraitPlaceholder, siteSettings } = props
  const heroPortrait = resolveMedia(siteSettings?.heroPortrait)

  return (
    <section className="container pt-4 pb-0">
      <div className="border border-border bg-white" id="hero">
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col justify-center px-8 py-9 lg:px-12 lg:py-11">
            {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
            <h1 className="max-w-[29rem] font-serif text-[3.35rem] leading-[0.97] tracking-[-0.04em] text-primary lg:text-[3.55rem]">
              {renderHeroHeading(heading)}
            </h1>
            {lead ? <p className="mt-5 max-w-[23rem] text-[0.96rem] leading-7 text-primary/82">{lead}</p> : null}
            <div className="mt-7">
              {primaryLink?.link ? (
                <CMSLink
                  {...primaryLink.link}
                  appearance="inline"
                  className="gold-button inline-flex min-w-[13.25rem] justify-center no-underline"
                />
              ) : (
                <a className="gold-button inline-flex min-w-[13.25rem] justify-center no-underline" href="#consultation">
                  Получить консультацию
                </a>
              )}
            </div>
          </div>

          <div className="border-t border-border lg:border-t-0 lg:border-l">
            <div className="relative h-full min-h-[420px] overflow-hidden bg-[#d6d0c6]">
              {heroPortrait ? (
                <Media
                  fill
                  imgClassName="h-full w-full object-cover"
                  pictureClassName="block h-full w-full"
                  priority
                  resource={heroPortrait}
                  size="(max-width: 1024px) 100vw, 52vw"
                />
              ) : (
                <PlaceholderPhoto
                  dark
                  title="Фотография будет добавлена после верификации"
                  description={
                    portraitPlaceholder ||
                    'Пока реальное фото не загружено в CMS, placeholder занимает ту же геометрию, что и будущий портрет.'
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TrustStripBlock(props: any) {
  const items = buildTrustItems(props.items)

  return (
    <section className="container pb-0">
      <div className="grid border-x border-b border-border bg-white md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = trustIcons[index % trustIcons.length]

          return (
            <div className="flex gap-4 border-b border-border px-6 py-4 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0" key={item.title}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-accent/55 text-accent">
                <Icon className="size-[1rem] stroke-[1.6]" />
              </div>
              <div>
                <p className="font-serif text-[1.12rem] leading-[1.15] text-primary">{item.title}</p>
                <p className="mt-1 text-[0.9rem] leading-6 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function PracticeGridBlock(props: any) {
  const { eyebrow, heading, description, areas, inlineFormTitle, sourcePage, siteSettings } = props
  const renderedAreas = buildPracticeItems(areas)

  return (
    <section className="container py-10" id="practice">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div className="max-w-[44rem]">
          {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
          {heading ? <h2 className="section-heading text-primary">{heading}</h2> : null}
        </div>
        <a className="hidden items-center gap-2 text-[0.9rem] text-primary transition-opacity hover:opacity-70 lg:inline-flex" href="#practice">
          Все направления
          <ArrowRight className="size-4 stroke-[1.7]" />
        </a>
      </div>
      {description ? <p className="mb-6 max-w-[43rem] text-[0.95rem] leading-7 text-muted-foreground">{description}</p> : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="grid auto-rows-fr gap-3 md:grid-cols-2 xl:grid-cols-4">
          {renderedAreas.map((area, index) => (
            <PracticeCard area={area} index={index} key={area.title} />
          ))}
        </div>

        <aside className="bg-primary px-7 py-7 text-white" id="consultation">
          <ConsultationForm
            buttonLabel="Отправить заявку"
            compact
            description="Оставьте заявку, и мы свяжемся с вами в ближайшее время."
            disclaimer={siteSettings?.consultationDisclaimer}
            sourcePage={sourcePage}
            title={inlineFormTitle || 'Нужна помощь адвоката?'}
          />
        </aside>
      </div>
    </section>
  )
}

export function AboutProfileBlock(props: any) {
  return (
    <section className="container py-10">
      <AboutColumn block={props} siteSettings={props.siteSettings} />
    </section>
  )
}

export function PublicationsListBlock(props: any) {
  return (
    <section className="container py-10">
      <PublicationsColumn block={props} />
    </section>
  )
}

export function ArticlesGridBlock(props: any) {
  const { eyebrow, heading, description, articles } = props

  return (
    <section className="container py-10">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div className="max-w-[44rem]">
          {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
          {heading ? <h2 className="section-heading text-primary">{heading}</h2> : null}
          {description ? <p className="mt-3 text-[0.95rem] leading-7 text-muted-foreground">{description}</p> : null}
        </div>
        <a className="hidden items-center gap-2 text-[0.9rem] text-primary transition-opacity hover:opacity-70 lg:inline-flex" href="/posts">
          Все статьи
          <ArrowRight className="size-4 stroke-[1.7]" />
        </a>
      </div>

      <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-4">
        {articles?.map((article: any, index: number) => (
          <article className="flex h-full flex-col border border-border bg-white" key={article?.id || index}>
            <div className="relative aspect-[4/3] overflow-hidden bg-[#ddd7cd]">
              {typeof article?.heroImage === 'object' && article.heroImage ? (
                <Media
                  fill
                  imgClassName="h-full w-full object-cover"
                  pictureClassName="block h-full w-full"
                  resource={article.heroImage}
                  size="(max-width: 1280px) 50vw, 22vw"
                />
              ) : (
                <div className="flex h-full items-end bg-[linear-gradient(180deg,rgba(16,28,49,0.04),rgba(16,28,49,0.22))] p-5">
                  <p className="text-[0.78rem] uppercase tracking-[0.22em] text-primary/55">Материал без обложки</p>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col px-6 py-5">
              <p className="text-[0.83rem] text-muted-foreground">
                {article?.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ru-RU') : 'Материал'}
              </p>
              <h3 className="mt-3 font-serif text-[1.55rem] leading-[1.22] text-primary">{article?.title}</h3>
              {article?.excerpt || article?.meta?.description ? (
                <p className="mt-3 flex-1 text-[0.92rem] leading-6 text-muted-foreground">{article.excerpt || article.meta.description}</p>
              ) : null}
              {article?.slug ? (
                <a className="mt-5 inline-flex items-center gap-2 text-[0.92rem] font-medium text-primary transition-opacity hover:opacity-70" href={`/posts/${article.slug}`}>
                  Читать далее
                  <ArrowRight className="size-4 stroke-[1.7]" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function BooksShowcaseBlock(props: any) {
  const { eyebrow, heading, description, books } = props
  const fullTextLabels: Record<string, string> = {
    'available-online': 'полный текст онлайн',
    'catalog-only': 'есть каталог',
    'reading-room': 'доступно в читальном зале',
    unavailable: 'без полного текста',
    unknown: 'статус текста уточняется',
  }

  return (
    <section className="container py-10" id="books">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div className="max-w-[46rem]">
          {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
          {heading ? <h2 className="section-heading text-primary">{heading}</h2> : null}
          {description ? <p className="mt-3 text-[0.95rem] leading-7 text-muted-foreground">{description}</p> : null}
        </div>
      </div>

      <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
        {books?.map((book: any, index: number) => (
          <article className="flex h-full flex-col border border-border bg-white px-6 py-6" key={book?.id || index}>
            <div className="flex items-start justify-between gap-4">
              <p className="font-serif text-[1.55rem] leading-[1.12] text-primary">{book?.title}</p>
              {book?.year ? <span className="text-[0.82rem] font-medium text-primary/60">{book.year}</span> : null}
            </div>
            {book?.authors ? <p className="mt-3 text-[0.88rem] uppercase tracking-[0.16em] text-primary/55">{book.authors}</p> : null}
            {book?.publisher ? <p className="mt-3 text-[0.92rem] leading-6 text-muted-foreground">{book.publisher}</p> : null}
            {book?.description ? <p className="mt-4 flex-1 text-[0.92rem] leading-6 text-muted-foreground">{book.description}</p> : null}
            <div className="mt-5 flex flex-wrap gap-2 text-[0.8rem] text-primary/68">
              {book?.pageCount ? <span className="border border-border px-2 py-1">{book.pageCount} стр.</span> : null}
              {book?.fullTextStatus ? (
                <span className="border border-border px-2 py-1">
                  {fullTextLabels[String(book.fullTextStatus)] || 'статус уточняется'}
                </span>
              ) : null}
            </div>
            {book?.url ? (
              <a className="mt-5 inline-flex items-center gap-2 text-[0.92rem] font-medium text-primary transition-opacity hover:opacity-70" href={book.url} rel="noreferrer" target="_blank">
                Открыть источник
                <ArrowRight className="size-4 stroke-[1.7]" />
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

export function FAQBlock(props: any) {
  const { eyebrow, heading, description, items } = props

  return (
    <section className="container py-10">
      {sectionTitle(eyebrow, heading, description)}
      <div className="grid gap-3">
        {items?.map((item: any, index: number) => (
          <details className="border border-border bg-white px-5 py-4" key={index}>
            <summary className="cursor-pointer list-none font-serif text-[1.35rem] leading-[1.2] text-primary">
              {item.question}
            </summary>
            {item.answer ? (
              <RichText className="mt-4 text-[0.95rem] leading-7 text-muted-foreground" data={item.answer} enableGutter={false} enableProse={false} />
            ) : null}
          </details>
        ))}
      </div>
    </section>
  )
}

export function ContactsBlock(props: any) {
  const settings = props.siteSettings

  return (
    <section className="container py-10">
      {sectionTitle(props.eyebrow, props.heading, props.description)}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="border border-border bg-white px-6 py-6 md:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="font-serif text-[2rem] leading-[1.08] text-primary">
                {settings?.fullName || 'Николай Павлович Ведищев'}
              </p>
              <p className="mt-2 text-[0.95rem] text-primary/72">{settings?.professionalStatus}</p>
              {settings?.advocateDetails ? (
                <p className="mt-5 text-[0.95rem] leading-7 text-muted-foreground">{settings.advocateDetails}</p>
              ) : null}
            </div>
            <div className="space-y-4 text-[0.95rem] leading-7 text-muted-foreground">
              {settings?.phone ? <p>Телефон: {settings.phone}</p> : null}
              {settings?.email ? <p>Email: {settings.email}</p> : null}
              {settings?.address ? <p>Адрес: {settings.address}</p> : null}
              {settings?.workingHours ? <p>Часы работы: {settings.workingHours}</p> : null}
            </div>
          </div>
        </div>

        <aside className="bg-primary px-7 py-7 text-white">
          <ConsultationForm
            buttonLabel="Отправить заявку"
            compact
            description="Оставьте заявку, и обращение сохранится в CMS."
            disclaimer={settings?.consultationDisclaimer}
            sourcePage={props.sourcePage}
            title="Запись на консультацию"
          />
        </aside>
      </div>
    </section>
  )
}

export function ConsultationCtaBlock(props: any) {
  return (
    <section className="container py-10">
      <div className="bg-primary px-7 py-8 text-white">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1fr)] lg:items-start">
          <div>
            {props.eyebrow ? <p className="section-kicker text-accent/90">{props.eyebrow}</p> : null}
            {props.heading ? (
              <h2 className="font-serif text-[2.35rem] leading-[1.05] text-white">{props.heading}</h2>
            ) : null}
            {props.description ? <p className="mt-4 max-w-[28rem] text-[0.95rem] leading-7 text-white/72">{props.description}</p> : null}
          </div>

          <div className="border border-white/10 bg-[#1f2c44] p-6">
            <ConsultationForm
              buttonLabel="Отправить обращение"
              description="Форма сохраняет заявку в CMS."
              disclaimer={props.siteSettings?.consultationDisclaimer}
              sourcePage={props.sourcePage}
              title={props.formTitle}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
