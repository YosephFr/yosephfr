import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSkillBySlug, getAllSkillSlugs } from "@/data/skills"
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

  const title = `${skill.name} - Skills`
  const description = skill.fullDescription.slice(0, 160)

  return {
    title,
    description,
    alternates: {
      canonical: `/skills/${slug}`,
    },
    openGraph: {
      title: `${skill.name} | Yoseph Franco`,
      description,
      url: `/skills/${slug}`,
    },
  }
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params
  const skill = getSkillBySlug(slug)

  if (!skill) {
    notFound()
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: skill.name,
    description: skill.fullDescription,
    numberOfItems: skill.items.length,
    itemListElement: skill.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <SkillContent slug={slug} />
    </>
  )
}
