"use client"

import dynamic from "next/dynamic"
import DetailLayout from "@/components/DetailLayout"

const TypingRace = dynamic(() => import("@/easter-eggs/games/TypingRace"), { ssr: false })

export default function TypingClient() {
  return (
    <DetailLayout>
      <div className="flex flex-col items-center">
        <h1 className="text-base font-semibold text-text-primary mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Typing Race
        </h1>
        <TypingRace />
      </div>
    </DetailLayout>
  )
}
