import dynamic from "next/dynamic"
import { noindex } from "@/lib/noindex"

const SecretoView = dynamic(() => import("./ui"))

export const metadata = { ...noindex, title: "Datos curiosos" }

export default function SecretoPage() {
  return <SecretoView />
}
