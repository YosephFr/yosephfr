"use client"

import Link from "next/link"
import { Github, Instagram, Linkedin } from "lucide-react"
import { useLocale } from "@/i18n"

export default function Footer() {
  const { t } = useLocale()

  return (
    <footer className="py-8 px-4 border-t border-surface-border">
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <a
            href="https://github.com/yosephfr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary hover:border-surface-hover transition-all duration-200"
            aria-label="GitHub"
          >
            <Github size={18} strokeWidth={1.5} />
          </a>
          <a
            href="https://www.linkedin.com/in/yosephfr/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary hover:border-surface-hover transition-all duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} strokeWidth={1.5} />
          </a>
          <a
            href="https://x.com/Arncof"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary hover:border-surface-hover transition-all duration-200"
            aria-label="X"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.725-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </a>
          <a
            href="https://www.instagram.com/yosephfranco/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary hover:border-surface-hover transition-all duration-200"
            aria-label="Instagram"
          >
            <Instagram size={18} strokeWidth={1.5} />
          </a>
          <a
            href="https://www.tiktok.com/@arncof"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-raised border border-surface-border text-text-muted hover:text-text-primary hover:border-surface-hover transition-all duration-200"
            aria-label="TikTok"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.5 3c.5 2.6 2 4.4 4.5 4.8v2.7c-1.5-.1-2.9-.6-4.1-1.4v6.7a5.9 5.9 0 1 1-5.9-5.9c.3 0 .7 0 1 .1v2.8a3.1 3.1 0 1 0 2.2 3V3h2.3Z" /></svg>
          </a>
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
            <Link href="/blog" className="hover:text-text-primary">{t.nav.blog}</Link>
            <span aria-hidden="true"> · </span>
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
