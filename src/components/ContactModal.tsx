"use client"

import { useModals } from "@/providers/ModalProvider"
import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { X, Send, Check } from "lucide-react"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ContactModal() {
  const { contactOpen, closeContact } = useModals()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const emailTouched = email.length > 0
  const emailValid = isValidEmail(email)

  const resetForm = useCallback(() => {
    setName("")
    setEmail("")
    setMessage("")
    setSent(false)
  }, [])

  useEffect(() => {
    if (!contactOpen) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        closeContact()
      }
    }

    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [contactOpen, closeContact])

  useEffect(() => {
    if (contactOpen) {
      resetForm()
    }
  }, [contactOpen, resetForm])

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
        resetForm()
        closeContact()
      }, 2000)
    },
    [name, email, emailValid, message, resetForm, closeContact]
  )

  if (!contactOpen) return null

  const emailBorderClass = emailTouched
    ? emailValid
      ? "border-accent"
      : "border-red-500"
    : "border-surface-border"

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeContact} />
      <div className="relative w-full max-w-[480px] bg-surface-raised border border-surface-border rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-lg font-semibold text-text-primary">
            Trabajemos juntos
          </h2>
          <button
            onClick={closeContact}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
              className="bg-surface-overlay border border-surface-border rounded-xl px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className={`bg-surface-overlay rounded-xl px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:outline-none transition-colors border ${emailBorderClass}`}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-text-muted uppercase tracking-wider mb-1.5">
              Mensaje
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Contame sobre tu proyecto..."
              required
              className="bg-surface-overlay border border-surface-border rounded-xl px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors min-h-[120px] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sent || !name.trim() || !emailValid || !message.trim()}
            className="w-full bg-accent text-surface font-medium py-3 rounded-xl hover:bg-accent-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sent ? (
              <>
                <Check size={16} strokeWidth={2} />
                <span>Enviado</span>
              </>
            ) : (
              <>
                <Send size={16} strokeWidth={2} />
                <span>Enviar mensaje</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  )
}
