"use client"

import Image from "next/image"
import { useState } from "react"

interface AvatarProps {
  size?: number
  className?: string
}

export default function Avatar({ size = 100, className = "" }: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-accent/10 border-2 border-accent/30 text-accent font-bold shrink-0 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.3 }}
      >
        YF
      </div>
    )
  }

  return (
    <Image
      src="/avatar.jpg"
      alt="Yoseph Franco"
      width={size}
      height={size}
      className={`rounded-full object-cover border-2 border-accent/30 shrink-0 ${className}`}
      onError={() => setHasError(true)}
      priority
    />
  )
}
