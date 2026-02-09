"use client"

import Link from "next/link"
import { useLocale } from "@/i18n"

export default function NotFound() {
  const { t } = useLocale()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-6xl font-bold text-accent">404</span>
        <h1 className="text-xl font-semibold text-text-primary mt-4">
          {t.notFound.title}
        </h1>
        <p className="text-sm text-text-muted mt-2">
          {t.notFound.description}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors mt-6"
        >
          {t.notFound.backHome}
        </Link>
      </div>
    </div>
  )
}
