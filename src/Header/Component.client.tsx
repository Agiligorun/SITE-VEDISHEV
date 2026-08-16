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
        <div className="grid gap-4 py-4 lg:grid-cols-[minmax(14rem,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center">
          <Link href="/">
            <Logo className="max-w-max" />
          </Link>

          <div className="hidden text-[0.92rem] leading-6 text-primary lg:block">
            <p className="font-semibold text-primary">{siteSettings?.fullName || 'Николай Павлович Ведищев'}</p>
            <p className="text-muted-foreground">{siteSettings?.professionalStatus || 'Адвокат'}</p>
          </div>

          <div className="hidden items-start gap-3 text-[0.9rem] leading-6 text-primary lg:flex">
            <MapPin className="mt-1 size-4 shrink-0 stroke-[1.7] text-accent" />
            <div>
              <p>{siteSettings?.address || 'Адрес будет подтвержден и заполнен через CMS'}</p>
              <p className="text-muted-foreground">{siteSettings?.workingHours || 'По предварительной записи'}</p>
            </div>
          </div>

          <div className="hidden items-start gap-3 text-[0.9rem] leading-6 text-primary lg:flex">
            <Phone className="mt-1 size-4 shrink-0 stroke-[1.7] text-accent" />
            <div>
              <p>{siteSettings?.phone || '+7 (000) 000-00-00'}</p>
              <p className="text-muted-foreground">{siteSettings?.email || 'email@example.com'}</p>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            {siteSettings?.primaryCTA?.link ? (
              <CMSLink {...siteSettings.primaryCTA.link} className="gold-button inline-flex min-w-[15rem] justify-center" />
            ) : (
              <a className="gold-button inline-flex min-w-[15rem] justify-center" href="#consultation">
                Записаться на консультацию
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-border py-3">
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
