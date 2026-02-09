"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { EXPERIENCE } from "@/data/experience"
import { useLocale } from "@/i18n"

export default function Experience() {
  const { t } = useLocale()

  return (
    <section id="experiencia" className="py-8 px-4">
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center gap-2 text-text-secondary mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
          <span className="text-sm tracking-[-0.2px]">{t.experience.label}</span>
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
          {EXPERIENCE.map((job) => {
            const roleTranslation = t.experience.roles[job.slug as keyof typeof t.experience.roles]

            return (
              <motion.div
                key={job.slug}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                }}
              >
                <Link
                  href={`/experiencia/${job.slug}`}
                  data-context-menu={`/experiencia/${job.slug}`}
                  className="group bg-surface-raised border border-surface-border rounded-2xl p-6 hover:border-surface-hover transition-all duration-300 block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium tracking-[-0.2px] text-text-primary group-hover:text-accent transition-colors duration-200">
                        {roleTranslation?.title ?? job.title}
                      </h3>
                      <p className="text-sm text-text-muted mt-0.5">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-text-muted bg-surface-overlay px-3 py-1 rounded-full">
                        {job.period}
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {roleTranslation?.shortDescription ?? job.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-text-muted bg-surface-overlay px-2.5 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
