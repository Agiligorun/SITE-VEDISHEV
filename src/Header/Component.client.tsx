'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/ui'
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
      className="relative z-20 border-b border-border/80 bg-white/95 backdrop-blur-sm"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="grid gap-6 py-6 lg:grid-cols-[minmax(16rem,1fr)_minmax(0,1.2fr)_auto] lg:items-center">
          <Link href="/">
            <Logo className="max-w-max" />
          </Link>

          <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent">
                Персональная практика
              </p>
              <p className="mt-2 font-semibold text-primary">
                {siteSettings?.fullName || 'Николай Павлович Ведищев'}
              </p>
              <p>{siteSettings?.professionalStatus || 'Адвокат'}</p>
            </div>
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent">
                Адрес
              </p>
              <p className="mt-2">{siteSettings?.address || 'Адрес будет заполнен через CMS'}</p>
              <p>{siteSettings?.workingHours || 'По предварительной записи'}</p>
            </div>
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent">
                Контакты
              </p>
              <p className="mt-2">{siteSettings?.phone || '+7 (000) 000-00-00'}</p>
              <p>{siteSettings?.email || 'email@example.com'}</p>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            {siteSettings?.primaryCTA?.link ? (
              <CMSLink {...siteSettings.primaryCTA.link} className="gold-button" />
            ) : (
              <a className="gold-button" href="#consultation">
                Записаться на консультацию
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-border/80 py-4">
          <div className="flex items-center justify-between lg:hidden">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent">
              Навигация
            </p>
            <button
              aria-expanded={isMenuOpen}
              className="rounded-full border border-primary/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
              onClick={() => setIsMenuOpen((current) => !current)}
              type="button"
            >
              {isMenuOpen ? 'Закрыть' : 'Меню'}
            </button>
          </div>
          <div className={cn('mt-4 lg:mt-0', isMenuOpen ? 'block' : 'hidden lg:block')}>
            <HeaderNav data={data} />
          </div>
        </div>
      </div>
    </header>
  )
}
