import BlogIndex from "@/components/blog/BlogIndex"
import { listingMetadata } from "@/lib/blog-meta"

export const metadata = listingMetadata("es")

export default function BlogPage() {
  return <BlogIndex lang="es" page={1} />
}
