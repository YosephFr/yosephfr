"use client"

import Link from "next/link"
import { useLocale } from "@/i18n"

export default function Footer() {
  const { t } = useLocale()

  return (
    <footer className="py-8 px-4 border-t border-surface-border">
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <a
            href="mailto:contacto@yosephfr.com"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary hover:border-surface-hover transition-all duration-200"
            aria-label="Email"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
          </a>
          <Link
            href="/contacto"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-surface hover:bg-accent-hover transition-all duration-200"
            aria-label={t.nav.contact}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </Link>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-muted">
            Yoseph Franco &middot; CABA, Argentina
          </p>
          <p className="text-xs text-text-muted/50 mt-2">
            {t.footer.cmdHint}
          </p>
        </div>
      </div>
    </footer>
  )
}
