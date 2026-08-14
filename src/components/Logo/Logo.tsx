import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <div className={clsx('flex flex-col text-primary', className)}>
      <span className="font-serif text-2xl leading-none tracking-[-0.03em]">Ведищев</span>
      <span className="mt-1 text-[0.68rem] uppercase tracking-[0.28em] text-muted-foreground">
        адвокатская практика
      </span>
    </div>
  )
}
