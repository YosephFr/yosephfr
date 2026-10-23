"use client"

import BackButton from "@/components/BackButton"
import DetailLayout from "@/components/DetailLayout"
import { useLocale } from "@/i18n"

export default function SecretoPage() {
  const { t } = useLocale()

  return (
    <DetailLayout>
      <BackButton />

      <div className="mt-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          {t.secreto.title}
        </h1>
        <p className="text-sm text-text-muted mt-2">
          {t.secreto.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        {t.secreto.facts.map((fact) => (
          <div
            key={fact.title}
            className="bg-surface-raised border border-surface-border rounded-xl p-5"
          >
            <h3 className="text-base font-medium text-text-primary">{fact.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed mt-2">
              {fact.description}
            </p>
          </div>
        ))}
      </div>
    </DetailLayout>
  )
}
