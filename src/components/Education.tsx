"use client"

import { GraduationCap, Award, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { EDUCATION, CERTIFICATIONS } from "@/data/education"
import { useLocale } from "@/i18n"

export default function Education() {
  const { t } = useLocale()

  return (
    <section id="educacion" className="px-4 mt-6">
      <div className="max-w-[640px] mx-auto">
        <motion.div
          className="flex items-center gap-2 text-text-secondary mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
          <span className="text-sm tracking-[-0.2px]">{t.education.label}</span>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {EDUCATION.map((edu) => (
            <motion.div
              key={edu.institution}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
            >
              <div className="group flex items-start gap-4 bg-surface-raised border border-surface-border rounded-2xl p-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl text-sm font-bold shrink-0 bg-blue-500/15 text-blue-400">
                  <GraduationCap size={20} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium tracking-[-0.2px] text-text-primary">
                    {edu.institution}
                  </h3>
                  <p className="text-sm text-text-muted mt-0.5">{edu.degree}</p>
                  <span className="text-xs text-text-muted mt-1 inline-block">{edu.period}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center gap-2 text-text-secondary mb-4 mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
          <span className="text-sm tracking-[-0.2px]">{t.education.certLabel}</span>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
          }}
        >
          {CERTIFICATIONS.map((cert) => (
            <motion.div
              key={cert.credentialId ?? cert.name}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
            >
              <div className="group flex items-center gap-4 bg-surface-raised border border-surface-border rounded-2xl p-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl text-sm font-bold shrink-0 bg-amber-500/15 text-amber-400">
                  <Award size={20} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium tracking-[-0.2px] text-text-primary">
                    {cert.name}
                  </h3>
                  <p className="text-sm text-text-muted mt-0.5">{cert.institution}</p>
                </div>
                {cert.credentialId && (
                  <a
                    href={`https://platzi.com/p/yosephfr/curso/${cert.credentialId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-text-muted hover:text-accent transition-colors duration-200"
                    aria-label={`${t.education.showCredential} - ${cert.name}`}
                  >
                    <ExternalLink size={16} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
