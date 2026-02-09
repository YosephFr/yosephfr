"use client"

import BackButton from "@/components/BackButton"
import DetailLayout from "@/components/DetailLayout"
import TypingRace from "@/easter-eggs/games/TypingRace"

export default function TypingPage() {
  return (
    <DetailLayout>
      <BackButton />
      <div className="mt-8 flex flex-col items-center">
        <h1 className="text-xl font-semibold text-text-primary mb-6">Typing Race</h1>
        <TypingRace />
      </div>
    </DetailLayout>
  )
}
