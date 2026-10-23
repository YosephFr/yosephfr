import ClickClient from "./ui"
import { noindex } from "@/lib/noindex"

export const metadata = { ...noindex, title: "Click Challenge" }

export default function ClickPage() {
  return <ClickClient />
}
