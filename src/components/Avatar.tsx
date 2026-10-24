"use client"

import Image from "next/image"
import { useState } from "react"
import { PROFILE } from "@/data/profile"

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
      src={PROFILE.photo}
      alt={PROFILE.name}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={`foto-perfil border-2 border-accent/30 shrink-0 ${className}`}
      style={{ width: size, height: size }}
      onError={() => setHasError(true)}
    />
  )
}
