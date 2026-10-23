import { site } from "@/lib/content.mjs"

export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": ["Person", "ProfilePage"],
    "@id": "https://yosephfr.com/#person",
    name: "Yoseph Franco",
    givenName: "Yoseph",
    familyName: "Franco",
    jobTitle: site.jobTitle,
    url: site.url,
    email: site.email,
    image: "https://yosephfr.com/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad Autonoma de Buenos Aires",
      addressCountry: "AR",
    },
    sameAs: site.sameAs,
    knowsAbout: [
      "AI & Agents",
      "Agentic AI",
      "Multi-Agent Orchestration",
      "LLM Integration",
      "Function Calling",
      "MCP (Model Context Protocol)",
      "OpenAI API",
      "Anthropic Claude API",
      "GoHighLevel Integration",
      "GHL Marketplace",
      "n8n Workflow Automation",
      "SaaS Architecture",
      "Node.js",
      "TypeScript",
      "React",
      "Next.js",
      "Fastify",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Conversational AI",
      "WhatsApp Automation",
      "AI Automation",
      "CRM Integration",
      "Prompt design",
    ],
    knowsLanguage: ["es", "en"],
    workLocation: {
      "@type": "Place",
      name: "Buenos Aires, Argentina",
    },
    description: site.positioning.es,
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Platzi",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://yosephfr.com/#website",
    name: site.siteTitle,
    url: site.url,
    description: site.positioning.es,
    inLanguage: ["es", "en"],
    author: {
      "@id": "https://yosephfr.com/#person",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}
