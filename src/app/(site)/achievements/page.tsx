import dynamic from "next/dynamic"
import { noindex } from "@/lib/noindex"

const AchievementsView = dynamic(() => import("./ui"))

export const metadata = { ...noindex, title: "Logros" }

export default function AchievementsPage() {
  return <AchievementsView />
}
