import Hero from "@/components/Hero"
import LatestPosts from "@/components/LatestPosts"
import Experience from "@/components/Experience"
import Skills from "@/components/Skills"
import Education from "@/components/Education"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"
import { getPublishedPosts } from "@/lib/content.mjs"

export default function Home() {
  const posts = getPublishedPosts("es").slice(0, 3).map((post) => ({
    href: post.path,
    title: post.title,
    description: post.description,
    date: post.date,
    readingMinutes: post.readingMinutes,
  }))

  return (
    <main className="min-h-screen">
      <Hero />
      <LatestPosts posts={posts} />
      <Experience />
      <Skills />
      <Education />
      <CTA />
      <Footer />
    </main>
  )
}
