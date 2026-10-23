import type { Metadata } from "next"
import type { ReactNode } from "react"
import BlogFrame from "@/components/blog/BlogFrame"

export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
      "application/feed+json": "/feed.json",
    },
  },
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <BlogFrame lang="es">{children}</BlogFrame>
}
