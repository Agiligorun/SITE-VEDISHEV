'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/ui'
import { MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  siteSettings: SiteSetting
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, siteSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const hasAddressBlock = Boolean(siteSettings?.address || siteSettings?.workingHours)
  const hasContactBlock = Boolean(siteSettings?.phone || siteSettings?.email)

  useEffect(() => {
    setHeaderTheme(null)
    setIsMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="relative z-20 border-b border-border bg-white"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="grid gap-4 py-3 lg:grid-cols-[15rem_12rem_minmax(15rem,1.15fr)_13rem_auto] lg:items-center">
          <Link href="/">
            <Logo className="max-w-max" />
          </Link>

          <div className="hidden text-[0.88rem] leading-5 text-primary lg:block">
            <p className="font-semibold text-primary">{siteSettings?.fullName || 'Николай Павлович Ведищев'}</p>
            <p className="text-muted-foreground">{siteSettings?.professionalStatus || 'Адвокат'}</p>
          </div>

          {hasAddressBlock ? (
            <div className="hidden items-start gap-2.5 text-[0.88rem] leading-5 text-primary lg:flex">
              <MapPin className="mt-0.5 size-4 shrink-0 stroke-[1.7] text-accent" />
              <div>
                {siteSettings?.address ? <p>{siteSettings.address}</p> : null}
                {siteSettings?.workingHours ? <p className="text-muted-foreground">{siteSettings.workingHours}</p> : null}
              </div>
            </div>
          ) : null}

          {hasContactBlock ? (
            <div className="hidden items-start gap-2.5 text-[0.88rem] leading-5 text-primary lg:flex">
              <Phone className="mt-0.5 size-4 shrink-0 stroke-[1.7] text-accent" />
              <div>
                {siteSettings?.phone ? <p>{siteSettings.phone}</p> : null}
                {siteSettings?.email ? <p className="text-muted-foreground">{siteSettings.email}</p> : null}
              </div>
            </div>
          ) : null}

          <div className="flex justify-start lg:justify-end">
            {siteSettings?.primaryCTA?.link ? (
              <CMSLink
                {...siteSettings.primaryCTA.link}
                appearance="inline"
                className="gold-button inline-flex min-w-[14rem] justify-center no-underline"
              />
            ) : (
              <a className="gold-button inline-flex min-w-[14rem] justify-center no-underline" href="#consultation">
                Записаться на консультацию
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-border py-2.5">
          <div className="flex items-center justify-between lg:hidden">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-accent">Навигация</p>
            <button
              aria-expanded={isMenuOpen}
              className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
              onClick={() => setIsMenuOpen((current) => !current)}
              type="button"
            >
              {isMenuOpen ? 'Закрыть' : 'Меню'}
            </button>
          </div>
          <div className={cn('mt-3 lg:mt-0', isMenuOpen ? 'block' : 'hidden lg:block')}>
            <HeaderNav data={data} />
          </div>
        </div>
      </div>
    </header>
  )
}
