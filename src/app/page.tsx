import Hero from "@/components/Hero"
import Experience from "@/components/Experience"
import Skills from "@/components/Skills"
import CTA from "@/components/CTA"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Experience />
      <Skills />
      <CTA />
      <Footer />
    </main>
  )
}
