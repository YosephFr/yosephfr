"use client"

import dynamic from "next/dynamic"
import DetailLayout from "@/components/DetailLayout"

const ClickChallenge = dynamic(() => import("@/easter-eggs/games/ClickChallenge"), { ssr: false })

export default function ClickClient() {
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
