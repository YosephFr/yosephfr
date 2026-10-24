"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"
import Footer from "@/components/Footer"

interface DetailLayoutProps {
  children: ReactNode
}

export default function DetailLayout({ children }: DetailLayoutProps) {
  return (
    <>
      <main id="contenido" className="marco juego">
        <motion.div
          className="juego-dentro"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
