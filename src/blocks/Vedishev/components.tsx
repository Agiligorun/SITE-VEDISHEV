import type { Config } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { ConsultationForm } from './ConsultationForm'

type SiteSettings = Config['globals']['site-settings']
type MediaResource = Config['collections']['media']

const resolveMedia = (value: unknown): MediaResource | null => {
  if (typeof value === 'object' && value !== null && 'url' in value) {
    return value as MediaResource
  }

  return null
}

const sectionIntro = (
  eyebrow?: string | null,
  heading?: string | null,
  description?: string | null,
  inverted = false,
) => (
  <div className="mb-10 max-w-3xl">
    {eyebrow ? <p className={inverted ? 'section-kicker text-accent/90' : 'section-kicker'}>{eyebrow}</p> : null}
    {heading ? <h2 className={`section-heading ${inverted ? 'text-white' : 'text-primary'}`}>{heading}</h2> : null}
    {description ? (
      <p className={`mt-4 max-w-2xl text-base leading-7 ${inverted ? 'text-white/72' : 'text-muted-foreground'}`}>
        {description}
      </p>
    ) : null}
  </div>
)

const PortraitPlaceholder = ({ title, description }: { title: string; description: string }) => (
  <div className="portrait-placeholder flex h-full flex-col justify-between p-6 md:p-8">
    <span className="placeholder-badge">PHOTO PLACEHOLDER</span>
    <div className="max-w-sm">
      <p className="font-serif text-2xl text-primary md:text-3xl">{title}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  </div>
)

export function HeroBlock(props: any) {
  const { eyebrow, heading, lead, primaryLink, secondaryLink, portraitPlaceholder, siteSettings } = props
  const heroPortrait = resolveMedia(siteSettings?.heroPortrait)

  return (
    <section className="section-shell pt-10 md:pt-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(22rem,0.98fr)] lg:items-center">
        <div className="max-w-2xl">
          {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
          <h1 className="max-w-3xl text-5xl leading-[0.98] text-primary md:text-7xl">{heading}</h1>
          {lead ? <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{lead}</p> : null}

          <div className="mt-8 flex flex-wrap gap-4">
            {primaryLink?.link ? <CMSLink {...primaryLink.link} className="gold-button" /> : null}
            {secondaryLink?.link ? (
              <CMSLink
                {...secondaryLink.link}
                className="rounded-full border border-primary/12 px-6 py-3 font-medium text-primary transition-colors hover:border-primary/25"
              />
            ) : null}
          </div>

          <div className="mt-10 grid gap-4 border-t border-primary/10 pt-6 text-sm text-muted-foreground sm:grid-cols-3">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent">Статус</p>
              <p className="mt-2 text-primary">{siteSettings?.professionalStatus || 'Адвокатская практика'}</p>
            </div>
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent">Адрес</p>
              <p className="mt-2 text-primary">
                {siteSettings?.address || 'Адрес будет добавлен через CMS после верификации'}
              </p>
            </div>
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent">Связь</p>
              <p className="mt-2 text-primary">{siteSettings?.phone || 'Контакт будет опубликован после проверки'}</p>
            </div>
          </div>
        </div>

        <div className="premium-card relative overflow-hidden p-5 md:p-7">
          <div className="absolute inset-x-8 top-0 h-px bg-accent/55" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#ebe6dc]">
            {heroPortrait ? (
              <>
                <Media
                  fill
                  imgClassName="h-full w-full object-cover"
                  pictureClassName="block h-full w-full"
                  priority
                  resource={heroPortrait}
                  size="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary via-primary/62 to-transparent px-6 pb-6 pt-12 text-white">
                  <p className="font-serif text-2xl">{siteSettings?.fullName || 'Николай Павлович Ведищев'}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.22em] text-white/72">
                    {siteSettings?.professionalStatus || 'Адвокат'}
                  </p>
                </div>
              </>
            ) : (
              <PortraitPlaceholder
                title="Фотография будет добавлена после верификации"
                description={
                  portraitPlaceholder ||
                  'Здесь будет подтвержденный портрет Николая Павловича Ведищева после согласования источника. До публикации используется только явно обозначенный placeholder.'
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function TrustStripBlock(props: any) {
  return (
    <section className="section-shell pt-0">
      <div className="premium-card grid gap-4 px-6 py-6 md:grid-cols-4 md:px-8">
        {props.items?.map((item: any, index: number) => (
          <div className="border-primary/8 md:border-r md:pr-6 last:border-r-0" key={index}>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent">
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="mt-3 font-serif text-xl text-primary">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PracticeGridBlock(props: any) {
  const { eyebrow, heading, description, areas, inlineFormTitle, sourcePage, siteSettings } = props

  return (
    <section className="section-shell">
      {sectionIntro(eyebrow, heading, description)}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {areas?.map((area: any, index: number) => (
            <article className="premium-card flex h-full flex-col p-6" key={area?.id || index}>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {area?.iconLabel?.slice(0, 2) || String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-5 font-serif text-2xl text-primary">{area?.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{area?.shortDescription}</p>
            </article>
          ))}
        </div>

        <aside className="rounded-[2rem] bg-primary p-6 text-white md:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent/90">Запись</p>
          <ConsultationForm
            compact
            description="Краткая форма остается на видном месте, как в референсе, и отправляет обращение прямо в CMS."
            disclaimer={siteSettings?.consultationDisclaimer}
            sourcePage={sourcePage}
            title={inlineFormTitle}
          />
        </aside>
      </div>
    </section>
  )
}

export function AboutProfileBlock(props: any) {
  const { eyebrow, heading, description, content, highlights, profileLink, siteSettings } = props
  const profilePortrait = resolveMedia(siteSettings?.profilePortrait)

  return (
    <section className="section-shell">
      <div className="grid gap-8 lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)] lg:items-start">
        <div className="premium-card overflow-hidden p-4 md:p-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-secondary">
            {profilePortrait ? (
              <Media
                fill
                imgClassName="h-full w-full object-cover"
                pictureClassName="block h-full w-full"
                resource={profilePortrait}
                size="(max-width: 1024px) 100vw, 28vw"
              />
            ) : (
              <PortraitPlaceholder
                title="Подтвержденный портрет добавляется позже"
                description="После подтверждения источника здесь появится портрет для блока «Об адвокате». До этого дизайн остается честным и явно помечает отсутствие production-фото."
              />
            )}
          </div>
        </div>

        <div>
          {sectionIntro(eyebrow, heading, description)}
          {content ? <RichText className="max-w-3xl text-primary" data={content} /> : null}
          {highlights?.length ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {highlights.map((item: any, index: number) => (
                <div className="premium-card p-5" key={index}>
                  <p className="font-serif text-xl text-primary">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          ) : null}
          {profileLink?.link ? <CMSLink {...profileLink.link} className="gold-button mt-8 inline-flex" /> : null}
        </div>
      </div>
    </section>
  )
}

export function PublicationsListBlock(props: any) {
  const { eyebrow, heading, description, publications } = props

  return (
    <section className="section-shell">
      {sectionIntro(eyebrow, heading, description)}
      <div className="premium-card divide-y divide-border overflow-hidden">
        {publications?.map((publication: any, index: number) => (
          <article className="grid gap-4 p-6 md:grid-cols-[12rem_minmax(0,1fr)_11rem]" key={publication?.id || index}>
            <div className="text-sm text-muted-foreground">{publication?.source}</div>
            <div>
              <h3 className="font-serif text-2xl text-primary">{publication?.title}</h3>
              {publication?.description ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{publication.description}</p>
              ) : null}
              {publication?.url ? (
                <a
                  className="mt-4 inline-flex text-sm font-semibold text-primary underline decoration-border underline-offset-4"
                  href={publication.url}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Открыть материал
                </a>
              ) : null}
            </div>
            <div className="text-sm text-muted-foreground md:text-right">
              {publication?.publishedAt
                ? new Date(publication.publishedAt).toLocaleDateString('ru-RU')
                : publication?.type}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ArticlesGridBlock(props: any) {
  const { eyebrow, heading, description, articles } = props

  return (
    <section className="section-shell">
      {sectionIntro(eyebrow, heading, description)}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {articles?.map((article: any, index: number) => (
          <article className="premium-card overflow-hidden" key={article?.id || index}>
            <div className="relative aspect-[4/3] bg-secondary">
              {typeof article?.heroImage === 'object' && article.heroImage ? (
                <Media
                  fill
                  imgClassName="h-full w-full object-cover"
                  pictureClassName="block h-full w-full"
                  resource={article.heroImage}
                  size="(max-width: 1280px) 50vw, 22vw"
                />
              ) : (
                <div className="flex h-full items-end bg-[linear-gradient(180deg,rgba(17,32,62,0.02),rgba(17,32,62,0.12))] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-primary/55">Материал без обложки</p>
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-accent">
                {article?.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ru-RU') : 'Материал'}
              </p>
              <h3 className="mt-3 font-serif text-2xl text-primary">{article?.title}</h3>
              {article?.meta?.description ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{article.meta.description}</p>
              ) : null}
              {article?.slug ? (
                <a className="mt-4 inline-flex text-sm font-semibold text-primary" href={`/posts/${article.slug}`}>
                  Читать далее
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function FAQBlock(props: any) {
  const { eyebrow, heading, description, items } = props

  return (
    <section className="section-shell">
      {sectionIntro(eyebrow, heading, description)}
      <div className="grid gap-4">
        {items?.map((item: any, index: number) => (
          <details className="premium-card p-6" key={index}>
            <summary className="cursor-pointer list-none font-serif text-2xl text-primary">{item.question}</summary>
            {item.answer ? <RichText className="mt-4" data={item.answer} /> : null}
          </details>
        ))}
      </div>
    </section>
  )
}

export function ContactsBlock(props: any) {
  const settings = props.siteSettings

  return (
    <section className="section-shell">
      {sectionIntro(props.eyebrow, props.heading, props.description)}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="premium-card p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="section-kicker">Контакты</p>
              <p className="font-serif text-3xl text-primary">{settings?.fullName || 'Николай Павлович Ведищев'}</p>
              <p className="mt-2 text-sm text-muted-foreground">{settings?.professionalStatus}</p>
              {settings?.advocateDetails ? (
                <p className="mt-6 text-sm leading-6 text-muted-foreground">{settings.advocateDetails}</p>
              ) : null}
            </div>
            <div className="space-y-4 text-sm leading-6 text-muted-foreground">
              {settings?.phone ? <p>Телефон: {settings.phone}</p> : null}
              {settings?.email ? <p>Email: {settings.email}</p> : null}
              {settings?.address ? <p>Адрес: {settings.address}</p> : null}
              {settings?.workingHours ? <p>Часы работы: {settings.workingHours}</p> : null}
              {settings?.telegram ? <p>Telegram: {settings.telegram}</p> : null}
              {settings?.whatsApp ? <p>WhatsApp: {settings.whatsApp}</p> : null}
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] bg-primary p-6 text-white md:p-8">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent/90">Консультация</p>
          <p className="mt-4 font-serif text-3xl">Спокойная и конфиденциальная коммуникация</p>
          <p className="mt-4 text-sm leading-6 text-white/72">
            Контактный блок сохраняет характер референса: без агрессивных обещаний, с понятной записью на консультацию и управляемыми данными из CMS.
          </p>
          <div className="mt-6 flex flex-col gap-3 text-sm">
            {settings?.telegram ? (
              <a className="rounded-full border border-white/16 px-4 py-3 text-white/84 transition-colors hover:border-white/28 hover:text-white" href={settings.telegram}>
                Написать в Telegram
              </a>
            ) : null}
            {settings?.whatsApp ? (
              <a className="rounded-full border border-white/16 px-4 py-3 text-white/84 transition-colors hover:border-white/28 hover:text-white" href={settings.whatsApp}>
                Написать в WhatsApp
              </a>
            ) : null}
          </div>
          <div className="mt-6">
            {settings?.primaryCTA?.link ? (
              <CMSLink {...settings.primaryCTA.link} className="gold-button" />
            ) : (
              <a className="gold-button" href="#consultation">
                Записаться на консультацию
              </a>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

export function ConsultationCtaBlock(props: any) {
  return (
    <section className="section-shell" id="consultation">
      <div className="rounded-[2rem] bg-primary px-6 py-8 text-white md:px-8 md:py-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1fr)] xl:items-start">
          <div>
            {sectionIntro(props.eyebrow, props.heading, props.description, true)}
            {props.siteSettings?.advocateDetails ? (
              <p className="max-w-xl text-sm leading-6 text-white/60">{props.siteSettings.advocateDetails}</p>
            ) : null}
          </div>
          <div className="rounded-[1.75rem] border border-white/12 bg-white/5 p-5 md:p-7">
            <ConsultationForm
              buttonLabel="Отправить обращение"
              description="Форма остается лаконичной, как в референсе, и передает заявку в CMS без лишних шагов."
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
