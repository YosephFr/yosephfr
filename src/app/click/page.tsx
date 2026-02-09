"use client"

import BackButton from "@/components/BackButton"
import DetailLayout from "@/components/DetailLayout"
import ClickChallenge from "@/easter-eggs/games/ClickChallenge"

export default function ClickPage() {
  return (
    <DetailLayout>
      <BackButton />
      <div className="mt-8 flex flex-col items-center">
        <h1 className="text-xl font-semibold text-text-primary mb-6">Click Challenge</h1>
        <ClickChallenge />
      </div>
    </DetailLayout>
  )
}
