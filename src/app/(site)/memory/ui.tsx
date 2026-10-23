"use client"

import dynamic from "next/dynamic"
import DetailLayout from "@/components/DetailLayout"

const MemoryGame = dynamic(() => import("@/easter-eggs/games/MemoryGame"), { ssr: false })

export default function MemoryClient() {
  return (
    <DetailLayout>
      <MemoryGame />
    </DetailLayout>
  )
}
