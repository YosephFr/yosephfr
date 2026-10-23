"use client"

import dynamic from "next/dynamic"
import DetailLayout from "@/components/DetailLayout"

const SnakeGame = dynamic(() => import("@/easter-eggs/games/SnakeGame"), { ssr: false })

export default function SnakeClient() {
  return (
    <DetailLayout>
      <SnakeGame />
    </DetailLayout>
  )
}
