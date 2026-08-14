'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex flex-col items-start gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-8 lg:gap-y-3">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="inline"
            className="text-[0.9rem] font-medium uppercase tracking-[0.18em] text-primary transition-opacity hover:opacity-70"
          />
        )
      })}
    </nav>
  )
}
