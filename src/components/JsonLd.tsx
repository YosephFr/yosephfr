export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yoseph Franco",
    jobTitle: "AI Engineer",
    url: "https://yosephfr.com",
    email: "contacto@yosephfr.com",
    image: "https://yosephfr.com/og-image.jpg",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad Autonoma de Buenos Aires",
      addressCountry: "AR",
    },
    sameAs: [],
    knowsAbout: [
      "AI Engineering",
      "Agentic AI",
      "Multi-Agent Orchestration",
      "LLM Integration",
      "Function Calling",
      "MCP",
      "OpenAI API",
      "Anthropic Claude API",
      "SaaS Architecture",
      "Node.js",
      "TypeScript",
      "React",
      "Next.js",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Conversational AI",
      "WhatsApp Automation",
    ],
    description:
      "AI Engineer con +6 anos de experiencia full stack. Construye agentes inteligentes, plataformas SaaS multi-tenant y sistemas de automatizacion con LLMs en produccion real.",
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Yoseph Franco | AI Engineer",
    url: "https://yosephfr.com",
    description:
      "Portfolio de Yoseph Franco. AI Engineer especializado en agentes inteligentes, plataformas SaaS con IA, Node.js, TypeScript, React y Next.js.",
    author: {
      "@type": "Person",
      name: "Yoseph Franco",
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
