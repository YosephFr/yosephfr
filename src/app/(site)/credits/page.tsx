import dynamic from "next/dynamic"
import { noindex } from "@/lib/noindex"

const CreditsView = dynamic(() => import("./ui"))

export const metadata = { ...noindex, title: "Créditos" }

export default function CreditsPage() {
  return <CreditsView />
}
