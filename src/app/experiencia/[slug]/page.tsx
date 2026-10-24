import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getExperienceBySlug, getAllExperienceSlugs } from "@/data/experience"
import { PROFILE } from "@/data/profile"
import { breadcrumbs, social } from "@/lib/seo"
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
  const description = role.shortDescription

  return {
    title,
    description,
    alternates: { canonical: `/experiencia/${slug}` },
    ...social({ title: `${title} | Yoseph Franco`, description, url: `/experiencia/${slug}`, type: "profile" }),
  }
}

export default async function ExperienciaDetailPage({ params }: Props) {
  const { slug } = await params
  const role = getExperienceBySlug(slug)

  if (!role) {
    notFound()
  }

  const url = `${PROFILE.url}/experiencia/${slug}`
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#pagina`,
        url,
        name: role.title,
        description: role.shortDescription,
        inLanguage: "es",
        isPartOf: { "@id": `${PROFILE.url}/#website` },
        about: { "@id": `${PROFILE.url}/#person` },
        mainEntity: {
          "@type": "Occupation",
          name: role.title,
          description: role.fullDescription,
          occupationLocation: { "@type": "City", name: "Buenos Aires" },
          skills: role.tags.join(", "),
        },
      },
      breadcrumbs([{ name: "Inicio", path: "/" }, { name: "CV", path: "/cv" }, { name: role.title, path: `/experiencia/${slug}` }]),
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <ExperienceContent slug={slug} />
    </>
  )
}
