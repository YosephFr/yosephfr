import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getExperienceBySlug, getAllExperienceSlugs } from "@/data/experience"
import ExperienceContent from "./ExperienceContent"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllExperienceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const role = getExperienceBySlug(slug)
  if (!role) return {}

  const title = role.title
  const description = role.fullDescription.slice(0, 160)

  return {
    title,
    description,
    alternates: {
      canonical: `/experiencia/${slug}`,
    },
    openGraph: {
      title: `${title} | Yoseph Franco`,
      description,
      url: `/experiencia/${slug}`,
      type: "profile",
    },
  }
}

export default async function ExperienciaDetailPage({ params }: Props) {
  const { slug } = await params
  const role = getExperienceBySlug(slug)

  if (!role) {
    notFound()
  }

  const occupationSchema = {
    "@context": "https://schema.org",
    "@type": "Occupation",
    name: role.title,
    description: role.fullDescription,
    occupationLocation: {
      "@type": "City",
      name: "Buenos Aires",
    },
    skills: role.tags.join(", "),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(occupationSchema) }}
      />
      <ExperienceContent slug={slug} />
    </>
  )
}
