"use client"

import DetailLayout from "@/components/DetailLayout"
import TypingRace from "@/easter-eggs/games/TypingRace"

export default function TypingPage() {
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
