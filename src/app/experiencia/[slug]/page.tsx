"use client"

import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { getExperienceBySlug } from "@/data/experience"
import BackButton from "@/components/BackButton"
import DetailLayout from "@/components/DetailLayout"
import { useLocale } from "@/i18n"

export default function ExperienciaDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t } = useLocale()
  const role = getExperienceBySlug(slug)

  if (!role) {
    notFound()
  }

  const roleTranslation = t.experience.roles[slug as keyof typeof t.experience.roles]

  return (
    <DetailLayout>
      <BackButton href="/#experiencia" />

      <div className="bg-surface-raised border border-surface-border rounded-3xl p-8 md:p-10 mt-6">
        <div>
          <span className="text-xs text-text-muted bg-surface-overlay px-3 py-1 rounded-full">
            {role.period}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary mt-4">
            {roleTranslation?.title ?? role.title}
          </h1>
          <p className="text-sm text-text-muted mt-1">{role.company}</p>
        </div>

        <p className="text-text-secondary leading-relaxed mt-6">
          {roleTranslation?.fullDescription ?? role.fullDescription}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-8">
          {role.metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-surface-overlay border border-surface-border rounded-xl p-4 text-center"
            >
              <span className="text-2xl font-bold text-accent">{metric.value}</span>
              <span className="block text-xs text-text-muted mt-1">{metric.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-medium text-text-primary mb-4">{t.detail.keyAchievements}</h2>
          <ul className="flex flex-col gap-3">
            {(roleTranslation?.achievements ?? role.achievements).map((achievement) => (
              <li key={achievement} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  &#10003;
                </span>
                <span className="text-sm text-text-secondary leading-relaxed">
                  {achievement}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-surface-border">
          {role.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-text-muted bg-surface-overlay px-2.5 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </DetailLayout>
  )
}
