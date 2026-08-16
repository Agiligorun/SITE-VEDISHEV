'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex flex-col items-start gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-8 lg:gap-y-2">
      {navItems.map(({ link }, i) => {
        const label = link.label || ''
        const showChevron = label === 'Адвокатская практика' || label === 'Публикации'

        return (
          <CMSLink
            key={i}
            {...link}
            appearance="inline"
            label={undefined}
            className="inline-flex items-center gap-1.5 text-[0.95rem] font-medium text-primary transition-opacity hover:opacity-70"
          >
            <span>{label}</span>
            {showChevron ? <ChevronDown className="mt-px size-3.5 stroke-[1.7]" /> : null}
          </CMSLink>
        )
      })}
    </nav>
  )
}
