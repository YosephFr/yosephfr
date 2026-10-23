export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": ["Person", "ProfilePage"],
    "@id": "https://yosephfr.com/#person",
    name: "Yoseph Franco",
    givenName: "Yoseph",
    familyName: "Franco",
    jobTitle: "AI builder",
    url: "https://yosephfr.com",
    email: "contacto@yosephfr.com",
    image: "https://yosephfr.com/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad Autonoma de Buenos Aires",
      addressCountry: "AR",
    },
    sameAs: [
      "https://www.linkedin.com/in/yosephfr/",
      "https://github.com/YosephFr",
      "https://x.com/yosephfr",
    ],
    knowsAbout: [
      "AI Engineering",
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
      "Prompt Engineering",
    ],
    knowsLanguage: ["es", "en"],
    nationality: {
      "@type": "Country",
      name: "Venezuela",
    },
    workLocation: {
      "@type": "Place",
      name: "Buenos Aires, Argentina",
    },
    description:
      "Construyo IA que conversa con clientes. ~14.000 conversaciones al mes, diseñadas y operadas por una sola persona. Escribo lo que funciona (y lo que se rompe) en producción.",
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Platzi",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://yosephfr.com/#website",
    name: "Yoseph Franco",
    url: "https://yosephfr.com",
    description:
      "Construyo IA que conversa con clientes. ~14.000 conversaciones al mes, diseñadas y operadas por una sola persona. Escribo lo que funciona (y lo que se rompe) en producción.",
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
