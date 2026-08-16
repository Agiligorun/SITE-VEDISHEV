import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { ConsultationForm } from '@/blocks/Vedishev/ConsultationForm'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const siteSettings = await getCachedGlobal('site-settings', 1)()

  const navItems = footerData?.navItems || []
  const legalLinks = siteSettings?.legalLinks || []
  const contactItems = [
    siteSettings?.address,
    siteSettings?.phone,
    siteSettings?.email,
    siteSettings?.workingHours,
  ].filter(Boolean)
  const hasContacts = contactItems.length > 0

  return (
    <footer className="mt-auto bg-primary text-white">
      <div className="container py-14">
        <div
          className={`grid gap-8 border-b border-white/12 pb-10 ${
            hasContacts
              ? 'lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1fr)]'
              : 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.85fr)_minmax(0,1fr)]'
          }`}
        >
          <div className="lg:pr-8 lg:border-r lg:border-white/14">
            <Link className="inline-flex items-center" href="/">
              <Logo className="text-white [&_span:last-child]:text-white/65 [&_span:first-child]:text-white" />
            </Link>
            <p className="mt-6 max-w-[15rem] text-[0.95rem] leading-8 text-white/76">
              {siteSettings?.footerNote ||
                'Персональная юридическая помощь для частных лиц и бизнеса с аккуратной и спокойной подачей.'}
            </p>
          </div>

          <div className="lg:px-8 lg:border-r lg:border-white/14">
            <p className="font-serif text-[2rem] leading-[1.08]">Навигация</p>
            <nav className="mt-5 flex flex-col gap-3 text-[0.95rem] text-white/78">
              {navItems.map(({ link }, i) => {
                return <CMSLink className="text-white/78 hover:text-white" key={i} {...link} />
              })}
            </nav>
          </div>

          {hasContacts ? (
            <div className="lg:px-8 lg:border-r lg:border-white/14">
              <p className="font-serif text-[2rem] leading-[1.08]">Контакты</p>
              <div className="mt-5 space-y-3 text-[0.95rem] leading-7 text-white/78">
                {siteSettings?.address ? <p>{siteSettings.address}</p> : null}
                {siteSettings?.phone ? <p>{siteSettings.phone}</p> : null}
                {siteSettings?.email ? <p>{siteSettings.email}</p> : null}
                {siteSettings?.workingHours ? <p>{siteSettings.workingHours}</p> : null}
              </div>
            </div>
          ) : null}

          <div className={hasContacts ? 'lg:pl-8' : ''}>
            <ConsultationForm
              buttonLabel="Отправить"
              description="Оставьте свой телефон, и мы свяжемся с вами для уточнения деталей."
              sourcePage="/footer"
              title="Запись на консультацию"
              variant="footer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-xs uppercase tracking-[0.22em] text-white/48">© 2026 vedishev.ru</div>
          {legalLinks.length ? (
            <div className="flex flex-wrap gap-4 text-xs text-white/54">
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
