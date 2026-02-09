"use client"

import { useState, useCallback } from "react"
import { Send, Check } from "lucide-react"
import { useLocale } from "@/i18n"
import BackButton from "@/components/BackButton"
import DetailLayout from "@/components/DetailLayout"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ContactPage() {
  const { t } = useLocale()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const emailTouched = email.length > 0
  const emailValid = isValidEmail(email)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!name.trim() || !emailValid || !message.trim()) return

      const subject = encodeURIComponent(`Contacto de ${name}`)
      const body = encodeURIComponent(
        `Nombre: ${name}\nEmail: ${email}\n\n${message}`
      )
      const mailto = `mailto:contacto@yosephfr.com?subject=${subject}&body=${body}`

      window.open(mailto, "_blank")
      setSent(true)

      setTimeout(() => {
        setName("")
        setEmail("")
        setMessage("")
        setSent(false)
      }, 3000)
    },
    [name, email, emailValid, message]
  )

  const emailBorderClass = emailTouched
    ? emailValid
      ? "border-accent"
      : "border-red-500"
    : "border-surface-border"

  return (
    <DetailLayout>
      <BackButton />

      <div className="mt-8 mb-10">
        <h1 className="text-[32px] md:text-4xl font-semibold tracking-tight leading-[1.2] mb-3">
          {t.contact.title}
        </h1>
        <p className="text-text-secondary text-base leading-relaxed max-w-md">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="bg-surface-raised border border-surface-border rounded-2xl p-8 md:p-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-xs text-text-muted uppercase tracking-wider mb-2">
              {t.contact.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.contact.namePlaceholder}
              required
              className="bg-surface-overlay border border-surface-border rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-text-muted uppercase tracking-wider mb-2">
              {t.contact.emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.contact.emailPlaceholder}
              required
              className={`bg-surface-overlay rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors border ${emailBorderClass}`}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-text-muted uppercase tracking-wider mb-2">
              {t.contact.messageLabel}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.contact.messagePlaceholder}
              required
              className="bg-surface-overlay border border-surface-border rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors min-h-[180px] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sent || !name.trim() || !emailValid || !message.trim()}
            className="w-full bg-accent text-surface font-medium py-3.5 rounded-xl hover:bg-accent-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {sent ? (
              <>
                <Check size={16} strokeWidth={2} />
                <span>{t.contact.sent}</span>
              </>
            ) : (
              <>
                <Send size={16} strokeWidth={2} />
                <span>{t.contact.send}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </DetailLayout>
  )
}
