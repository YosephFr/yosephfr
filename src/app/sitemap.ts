import type { MetadataRoute } from "next"
import { getSitemapEntries } from "@/lib/content.mjs"

export const dynamic = "force-static"

const CHUNK = 2000

export async function generateSitemaps() {
  const count = Math.max(1, Math.ceil(getSitemapEntries().length / CHUNK))
  return Array.from({ length: count }, (_, id) => ({ id }))
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const resolved = Number(await id)
  return getSitemapEntries()
    .slice(resolved * CHUNK, (resolved + 1) * CHUNK)
    .map((entry) => ({
      url: entry.loc,
      lastModified: new Date(entry.lastModified),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      ...(entry.languages ? { alternates: { languages: entry.languages } } : {}),
    }))
}
