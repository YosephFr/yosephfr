"use client"

import { useEasterEggContext } from "@/providers/EasterEggProvider"
import BackButton from "@/components/BackButton"
import DetailLayout from "@/components/DetailLayout"
import { Trophy, Lock, Eye } from "lucide-react"
import { useLocale } from "@/i18n"

export default function AchievementsPage() {
  const { progress, getAllEggs, isDiscovered } = useEasterEggContext()
  const { t } = useLocale()
  const eggs = getAllEggs()

  const categories = eggs.reduce<Record<string, typeof eggs>>((acc, egg) => {
    return {
      ...acc,
      [egg.category]: [...(acc[egg.category] || []), egg],
    }
  }, {})

  const percentage = progress.total > 0 ? Math.round((progress.found / progress.total) * 100) : 0

  return (
    <DetailLayout>
      <BackButton />

      <div className="mt-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy size={24} className="text-accent" />
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            {t.achievements.title}
          </h1>
        </div>
        <p className="text-sm text-text-muted">
          {t.achievements.subtitle}
        </p>
      </div>

      <div className="mt-6 bg-surface-raised border border-surface-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-text-secondary">{t.achievements.totalProgress}</span>
          <span className="text-sm font-medium text-accent">
            {progress.found} / {progress.total}
          </span>
        </div>
        <div className="w-full h-2 bg-surface-overlay rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-text-muted mt-2">{percentage}% {t.achievements.completed}</p>
      </div>

      <div className="flex flex-col gap-6 mt-8">
        {Object.entries(categories).map(([category, categoryEggs]) => {
          const foundInCategory = categoryEggs.filter((e) => isDiscovered(e.id)).length

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-text-primary">
                  {t.achievements.categories[category as keyof typeof t.achievements.categories] || category}
                </h2>
                <span className="text-xs text-text-muted">
                  {foundInCategory}/{categoryEggs.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {categoryEggs.map((egg) => {
                  const found = isDiscovered(egg.id)
                  return (
                    <div
                      key={egg.id}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 border transition-all ${
                        found
                          ? "bg-accent/5 border-accent/20"
                          : "bg-surface-overlay border-surface-border"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                          found
                            ? "bg-accent/15 text-accent"
                            : "bg-surface-border text-text-muted"
                        }`}
                      >
                        {found ? <Eye size={14} /> : <Lock size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`block text-sm ${
                            found ? "text-text-primary" : "text-text-muted"
                          }`}
                        >
                          {found ? egg.name : "???"}
                        </span>
                        <span className="block text-xs text-text-muted truncate">
                          {found ? egg.hint : t.achievements.secretLabel}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </DetailLayout>
  )
}
