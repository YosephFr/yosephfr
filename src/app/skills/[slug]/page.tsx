import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSkillBySlug, getAllSkillSlugs } from "@/data/skills"
import { PROFILE } from "@/data/profile"
import { breadcrumbs, social } from "@/lib/seo"
import SkillContent from "./SkillContent"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSkillSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const skill = getSkillBySlug(slug)
  if (!skill) return {}

  const title = skill.name
  const description = skill.fullDescription.slice(0, 160)

  return {
    title,
    description,
    alternates: { canonical: `/skills/${slug}` },
    ...social({ title: `${skill.name} | Yoseph Franco`, description, url: `/skills/${slug}` }),
  }
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params
  const skill = getSkillBySlug(slug)

  if (!skill) {
    notFound()
  }

  const url = `${PROFILE.url}/skills/${slug}`
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#pagina`,
        url,
        name: skill.name,
        description: skill.description,
        inLanguage: "es",
        isPartOf: { "@id": `${PROFILE.url}/#website` },
        about: { "@id": `${PROFILE.url}/#person` },
        mainEntity: {
          "@type": "ItemList",
          name: skill.name,
          numberOfItems: skill.items.length,
          itemListElement: skill.items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name })),
        },
      },
      breadcrumbs([{ name: "Inicio", path: "/" }, { name: "CV", path: "/cv" }, { name: skill.name, path: `/skills/${slug}` }]),
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <SkillContent slug={slug} />
    </>
  )
}
