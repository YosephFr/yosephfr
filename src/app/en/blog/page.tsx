import BlogIndex from "@/components/blog/BlogIndex"
import { listingMetadata } from "@/lib/blog-meta"

export const metadata = listingMetadata("en")

export default function EnglishBlogPage() {
  return <BlogIndex lang="en" page={1} />
}
