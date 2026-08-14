'use client'

import { useState } from 'react'

type Props = {
  buttonLabel?: string
  compact?: boolean
  description?: string
  disclaimer?: string
  title?: string
  sourcePage: string
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
}: Props) {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

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

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <p className="mb-2 font-serif text-2xl text-white">{title}</p>
        <p className="text-sm leading-6 text-white/70">{description}</p>
      </div>

      <div className={compact ? 'space-y-3' : 'grid gap-3 md:grid-cols-2'}>
        <input
          className="h-12 rounded-2xl border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-white/45"
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Ваше имя"
          required
          value={form.name}
        />
        <input
          className="h-12 rounded-2xl border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-white/45"
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          placeholder="Телефон"
          required
          value={form.phone}
        />
        <input
          className="h-12 rounded-2xl border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-white/45"
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="Email"
          type="email"
          value={form.email}
        />
        <input
          className="h-12 rounded-2xl border border-white/15 bg-white/8 px-4 text-sm text-white placeholder:text-white/45"
          onChange={(event) => setForm((prev) => ({ ...prev, messenger: event.target.value }))}
          placeholder="Telegram / WhatsApp"
          value={form.messenger}
        />
      </div>

      <textarea
        className="min-h-28 w-full rounded-[1.5rem] border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/45"
        onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
        placeholder="Кратко опишите вопрос"
        value={form.message}
      />

      <button className="gold-button w-full" disabled={status === 'loading'} type="submit">
        {status === 'loading' ? 'Отправляем...' : buttonLabel}
      </button>

      {disclaimer ? <p className="text-xs leading-5 text-white/55">{disclaimer}</p> : null}

      {status === 'success' && (
        <p className="text-sm text-emerald-200">Заявка сохранена. Мы можем продолжать обработку через CMS.</p>
      )}

      {status === 'error' && <p className="text-sm text-rose-200">{error}</p>}
    </form>
  )
}
