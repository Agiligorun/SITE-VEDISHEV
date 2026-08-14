import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const siteSettings = await getCachedGlobal('site-settings', 1)()

  const navItems = footerData?.navItems || []
  const legalLinks = siteSettings?.legalLinks || []

  return (
    <footer className="mt-auto bg-primary text-white">
      <div className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Link className="inline-flex items-center" href="/">
              <Logo className="text-white [&_span:last-child]:text-white/65 [&_span:first-child]:text-white" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/72">
              {siteSettings?.professionalStatus ||
                'Персональный сайт адвоката с управляемым контентом и спокойной премиальной визуальной подачей.'}
            </p>
            {siteSettings?.footerNote ? (
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/56">{siteSettings.footerNote}</p>
            ) : null}
          </div>

          <div>
            <p className="font-serif text-2xl">Навигация</p>
            <nav className="mt-5 flex flex-col gap-3 text-sm text-white/78">
              {navItems.map(({ link }, i) => {
                return <CMSLink className="text-white/78 hover:text-white" key={i} {...link} />
              })}
            </nav>
          </div>

          <div>
            <p className="font-serif text-2xl">Контакты</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-white/78">
              {siteSettings?.address ? <p>{siteSettings.address}</p> : null}
              {siteSettings?.phone ? <p>{siteSettings.phone}</p> : null}
              {siteSettings?.email ? <p>{siteSettings.email}</p> : null}
              {siteSettings?.workingHours ? <p>{siteSettings.workingHours}</p> : null}
            </div>
          </div>

          <div>
            <p className="font-serif text-2xl">Консультация</p>
            <p className="mt-5 text-sm leading-7 text-white/72">
              Конфиденциальная коммуникация и аккуратная запись на консультацию без агрессивных обещаний и навязчивых триггеров.
            </p>
            <div className="mt-6">
              {siteSettings?.primaryCTA?.link ? (
                <CMSLink {...siteSettings.primaryCTA.link} className="gold-button" />
              ) : (
                <a className="gold-button" href="#consultation">
                  Связаться
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-xs uppercase tracking-[0.22em] text-white/45">© 2026 vedishev.ru</div>
          {legalLinks.length ? (
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.18em] text-white/52">
              {legalLinks.map((item) => (
                <a
                  className="transition-colors hover:text-white"
                  href={item.url}
                  key={item.id || item.url}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
