'use client'

import { useState } from 'react'

type Props = {
  buttonLabel?: string
  compact?: boolean
  description?: string
  disclaimer?: string
  title?: string
  sourcePage: string
  variant?: 'default' | 'footer'
}

const initialState = {
  name: '',
  phone: '',
  email: '',
  messenger: '',
  message: '',
}

export function ConsultationForm({
  buttonLabel = 'Записаться на консультацию',
  compact = false,
  description = 'Оставьте контакт, и заявка сохранится в CMS для дальнейшей обработки.',
  disclaimer,
  title = 'Нужна помощь адвоката?',
  sourcePage,
  variant = 'default',
}: Props) {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const isFooter = variant === 'footer'

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          name: isFooter ? form.name || 'Footer consultation request' : form.name,
          sourcePage,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || 'Не удалось отправить заявку.')
      }

      setForm(initialState)
      setStatus('success')
    } catch (submissionError) {
      setStatus('error')
      setError(
        submissionError instanceof Error ? submissionError.message : 'Не удалось отправить заявку.',
      )
    }
  }

  const titleClassName = isFooter
    ? 'font-serif text-[1.85rem] leading-[1.1] text-white'
    : 'mb-2 font-serif text-[2rem] leading-[1.08] text-white'
  const descriptionClassName = isFooter
    ? 'mt-4 text-[0.95rem] leading-7 text-white/72'
    : 'text-sm leading-6 text-white/70'
  const inputClassName =
    'h-11 w-full border border-white/10 bg-[#24324b] px-4 text-sm text-white placeholder:text-white/46 focus:outline-none'
  const textareaClassName =
    'min-h-[120px] w-full border border-white/10 bg-[#24324b] px-4 py-3 text-sm text-white placeholder:text-white/46 focus:outline-none'

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <p className={titleClassName}>{title}</p>
        <p className={descriptionClassName}>{description}</p>
      </div>

      {isFooter ? (
        <div className="space-y-3">
          <input
            className={inputClassName}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="Ваш телефон"
            required
            value={form.phone}
          />
          <button className="gold-button w-full justify-center" disabled={status === 'loading'} type="submit">
            {status === 'loading' ? 'Отправляем...' : buttonLabel}
          </button>
        </div>
      ) : (
        <>
          <div className={compact ? 'space-y-3' : 'grid gap-3 md:grid-cols-2'}>
            <input
              className={inputClassName}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Ваше имя"
              required
              value={form.name}
            />
            <input
              className={inputClassName}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="Ваш телефон"
              required
              value={form.phone}
            />
            <input
              className={inputClassName}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              type="email"
              value={form.email}
            />
            <input
              className={inputClassName}
              onChange={(event) => setForm((prev) => ({ ...prev, messenger: event.target.value }))}
              placeholder="Telegram / WhatsApp"
              value={form.messenger}
            />
          </div>

          <textarea
            className={textareaClassName}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            placeholder="Опишите ваш вопрос"
            value={form.message}
          />

          <button className="gold-button w-full justify-center" disabled={status === 'loading'} type="submit">
            {status === 'loading' ? 'Отправляем...' : buttonLabel}
          </button>
        </>
      )}

      {disclaimer ? <p className="text-[0.75rem] leading-5 text-white/50">{disclaimer}</p> : null}

      {status === 'success' && (
        <p className="text-sm text-emerald-200">
          {isFooter
            ? 'Телефон сохранен. Мы свяжемся через CMS.'
            : 'Заявка сохранена. Мы можем продолжать обработку через CMS.'}
        </p>
      )}

      {status === 'error' && <p className="text-sm text-rose-200">{error}</p>}
    </form>
  )
}
