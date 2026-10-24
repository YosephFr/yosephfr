import Link from "next/link"
import DotIcon from "@/components/dots/DotIcon"

interface BackButtonProps {
  href?: string
  label?: string
}

export default function BackButton({ href = "/", label = "Volver" }: BackButtonProps) {
  return (
    <Link href={href} className="enlace enlace-suave volver">
      <DotIcon name="volver" size={14} />
      {label}
    </Link>
  )
}
