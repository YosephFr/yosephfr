"use client"

import BackButton from "@/components/BackButton"
import DetailLayout from "@/components/DetailLayout"
import { useLocale } from "@/i18n"

export default function CreditsPage() {
  const { t } = useLocale()

  return (
    <DetailLayout>
      <BackButton />

      <div className="mt-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          {t.credits.title}
        </h1>
        <div className="mt-12 flex flex-col gap-10">
          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider">
              {t.credits.designedBy}
            </span>
            <p className="text-lg font-medium text-text-primary mt-2">
              Yoseph Franco
            </p>
          </div>
          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider">
              {t.credits.builtWith}
            </span>
            <p className="text-lg font-medium text-text-primary mt-2">
              Next.js, Tailwind CSS, Lucide Icons
            </p>
          </div>
          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider">
              {t.credits.typography}
            </span>
            <p className="text-lg font-medium text-text-primary mt-2">
              Inter
            </p>
          </div>
          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider">
              {t.credits.deployedOn}
            </span>
            <p className="text-lg font-medium text-text-primary mt-2">
              Google Cloud
            </p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-surface-border">
          <p className="text-xs text-text-muted">
            {t.credits.footer}
          </p>
        </div>
      </div>
    </DetailLayout>
  )
}
