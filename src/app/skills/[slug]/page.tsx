"use client"

import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import { getSkillBySlug } from "@/data/skills"
import BackButton from "@/components/BackButton"
import DetailLayout from "@/components/DetailLayout"
import { useLocale } from "@/i18n"

const LEVEL_STYLES: Record<string, string> = {
  expert: "text-accent",
  advanced: "text-amber-400",
  intermediate: "text-text-muted",
}

export default function SkillDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { t } = useLocale()
  const skill = getSkillBySlug(slug)

  if (!skill) {
    notFound()
  }

  const categoryTranslation = t.skills.categories[slug as keyof typeof t.skills.categories]
  const levelLabels: Record<string, string> = {
    expert: t.detail.expert,
    advanced: t.detail.advanced,
    intermediate: t.detail.intermediate,
  }

  return (
    <DetailLayout>
      <BackButton href="/#skills" />

      <div className="bg-surface-raised border border-surface-border rounded-3xl p-8 md:p-10 mt-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-xl text-base font-bold shrink-0 ${skill.color}`}
          >
            {skill.icon}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              {categoryTranslation?.name ?? skill.name}
            </h1>
            <span className="text-[10px] font-medium text-text-muted bg-surface-overlay px-3 py-1 rounded-full uppercase tracking-wider mt-1 inline-block">
              {categoryTranslation?.badge ?? skill.badge}
            </span>
          </div>
        </div>

        <p className="text-text-secondary leading-relaxed mt-6">
          {skill.fullDescription}
        </p>

        <div className="mt-8">
          <h2 className="text-sm font-medium text-text-primary mb-4">{t.detail.skillsLabel}</h2>
          <div className="flex flex-col gap-2">
            {skill.items.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between bg-surface-overlay border border-surface-border rounded-xl px-4 py-3"
              >
                <span className="text-sm text-text-primary">{item.name}</span>
                <span className={`text-xs font-medium ${LEVEL_STYLES[item.level]}`}>
                  {levelLabels[item.level]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-medium text-text-primary mb-4">{t.detail.tools}</h2>
          <div className="flex flex-wrap gap-2">
            {skill.tools.map((tool) => (
              <span
                key={tool}
                className="text-xs text-text-muted bg-surface-overlay px-3 py-1.5 rounded-md border border-surface-border"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DetailLayout>
  )
}
