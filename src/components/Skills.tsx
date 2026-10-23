"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { SKILLS } from "@/data/skills"
import { useLocale } from "@/i18n"

export default function Skills() {
  const { t } = useLocale()

  return (
    <section id="skills" className="px-4 mt-6">
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center gap-2 text-text-secondary mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
          <span className="text-sm tracking-[-0.2px]">{t.skills.label}</span>
        </div>

        <div className="flex flex-col gap-3">
          {SKILLS.map((skill) => {
            const categoryTranslation = t.skills.categories[skill.slug as keyof typeof t.skills.categories]

            return (
              <div key={skill.slug}>
                <Link
                  href={`/skills/${skill.slug}`}
                  data-context-menu={`/skills/${skill.slug}`}
                  className="group flex items-center gap-4 bg-surface-raised border border-surface-border rounded-2xl p-5 hover:border-surface-hover transition-all duration-300"
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl text-sm font-bold shrink-0 ${skill.color}`}
                  >
                    {skill.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium tracking-[-0.2px] text-text-primary">
                      {categoryTranslation?.name ?? skill.name}
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5 truncate">
                      {categoryTranslation?.description ?? skill.description}
                    </p>
                  </div>
                  <span className="hidden sm:inline text-[10px] font-medium text-text-muted bg-surface-overlay px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                    {categoryTranslation?.badge ?? skill.badge}
                  </span>
                  <ExternalLink
                    size={16}
                    className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
                  />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
