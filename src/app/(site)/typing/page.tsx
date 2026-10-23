import TypingClient from "./ui"
import { noindex } from "@/lib/noindex"

export const metadata = { ...noindex, title: "Typing Race" }

export default function TypingPage() {
  return <TypingClient />
}
