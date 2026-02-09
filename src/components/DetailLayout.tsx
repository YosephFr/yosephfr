"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface DetailLayoutProps {
  children: ReactNode
}

export default function DetailLayout({ children }: DetailLayoutProps) {
  return (
    <motion.div
      className="max-w-[640px] mx-auto pt-28 pb-16 px-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
