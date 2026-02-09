import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  href?: string
}

export default function BackButton({ href = "/" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
    >
      <ArrowLeft size={16} strokeWidth={1.5} />
      Volver
    </Link>
  )
}
