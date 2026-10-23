import SnakeClient from "./ui"
import { noindex } from "@/lib/noindex"

export const metadata = { ...noindex, title: "Snake" }

export default function SnakePage() {
  return <SnakeClient />
}
