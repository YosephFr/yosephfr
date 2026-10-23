"use client"

import { Mail } from "lucide-react"
import { useLocale } from "@/i18n"

export default function CTA() {
  const { t } = useLocale()

  return (
    <section className="py-10 px-4">
      <div className="max-w-[640px] mx-auto text-center animate-fade-in-up">
        <h2 className="text-[32px] md:text-4xl font-semibold tracking-tight mb-4">
          {t.cta.title}
        </h2>
        <p className="text-text-secondary text-base mb-8 max-w-md mx-auto">
          {t.cta.subtitle}
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="mailto:contacto@yosephfr.com"
            className="inline-flex items-center gap-2 bg-accent text-surface text-sm font-medium px-6 py-3 rounded-full hover:bg-accent-hover transition-all duration-200"
          >
            <Mail size={16} strokeWidth={1.5} />
            {t.hero.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
