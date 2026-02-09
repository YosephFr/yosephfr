"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useLocale } from "@/i18n"
import Avatar from "./Avatar"

export default function Hero() {
  const { t } = useLocale()

  return (
    <section id="inicio" className="pt-28 pb-8 px-4">
      <div className="max-w-[640px] mx-auto">
        <motion.div
          className="bg-surface-raised border border-surface-border rounded-3xl p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-8">
            <div
              className="flex items-center gap-2 text-text-secondary"
              data-egg-click="logo"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
              <span className="text-sm tracking-[-0.2px]">{t.hero.role}</span>
            </div>
            <div
              className="flex items-center gap-2 bg-accent-soft rounded-full px-4 py-1.5"
              data-egg-click="disponible"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-accent uppercase tracking-wider">
                {t.hero.available}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div data-egg-click="avatar">
              <div className="rounded-full ring-2 ring-accent/30 ring-offset-2 ring-offset-surface-raised">
                <Avatar size={56} />
              </div>
            </div>
            <h1
              className="text-[28px] md:text-[32px] font-bold tracking-[-0.03em] leading-[1.2]"
              style={{ fontFamily: "var(--font-heading)" }}
              data-egg-click="name"
            >
              {t.hero.name}
            </h1>
          </div>

          <p className="text-text-secondary text-base leading-relaxed mb-6">
            {t.hero.tagline}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-accent text-surface text-sm font-medium px-5 py-2.5 rounded-full hover:bg-accent-hover transition-all duration-200"
            >
              <span className="text-base leading-none">+</span>
              {t.hero.cta}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
