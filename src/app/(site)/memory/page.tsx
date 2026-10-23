import MemoryClient from "./ui"
import { noindex } from "@/lib/noindex"

export const metadata = { ...noindex, title: "Memory" }

export default function MemoryPage() {
  return <MemoryClient />
}
