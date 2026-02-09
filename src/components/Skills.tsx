"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { SKILLS } from "@/data/skills"
import { useLocale } from "@/i18n"

export default function Skills() {
  const { t } = useLocale()

  return (
    <section id="skills" className="py-8 px-4 scroll-mt-28">
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
            <span className="text-sm tracking-[-0.2px]">{t.skills.label}</span>
          </div>
        </div>

        <motion.div
          className="flex flex-col gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {SKILLS.map((skill) => {
            const categoryTranslation = t.skills.categories[skill.slug as keyof typeof t.skills.categories]

            return (
              <motion.div
                key={skill.slug}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                }}
              >
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
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
