"use client"

import Link from "next/link"
import { Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useLocale } from "@/i18n"

export default function CTA() {
  const { t } = useLocale()

  return (
    <section className="py-16 px-4">
      <motion.div
        className="max-w-[640px] mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <h2 className="text-[32px] md:text-4xl font-semibold tracking-tight mb-4">
          {t.cta.title}
        </h2>
        <p className="text-text-secondary text-base mb-8 max-w-md mx-auto">
          {t.cta.subtitle}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-accent text-surface text-sm font-medium px-6 py-3 rounded-full hover:bg-accent-hover transition-all duration-200"
          >
            <Mail size={16} strokeWidth={1.5} />
            {t.hero.cta}
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
