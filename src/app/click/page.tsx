"use client"

import DetailLayout from "@/components/DetailLayout"
import ClickChallenge from "@/easter-eggs/games/ClickChallenge"

export default function ClickPage() {
  return (
    <DetailLayout>
      <div className="flex flex-col items-center">
        <h1 className="text-base font-semibold text-text-primary mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Click Challenge
        </h1>
        <ClickChallenge />
      </div>
    </DetailLayout>
  )
}
