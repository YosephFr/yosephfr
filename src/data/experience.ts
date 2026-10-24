export interface ExperienceRole {
  slug: string
  title: string
  company: string
  period: string
  badge: string
  shortDescription: string
  fullDescription: string
  achievements: string[]
  tags: string[]
  metrics: { label: string; value: string }[]
}

export const EXPERIENCE: ExperienceRole[] = [
  {
    slug: "ai-engineering",
    title: "Ingeniería de IA y agentes",
    company: "Independiente",
    period: "2025–actualidad",
    badge: "AI Engineer",
    shortDescription:
      "Agentes para atención, ventas y operaciones; plataformas SaaS, reservas e integraciones con CRM. Del diseño del flujo a su operación.",
    fullDescription:
      "Diseño y construcción de sistemas de IA en producción real. Agentes conversacionales autónomos con function calling que gestionan ventas, soporte y operaciones vía WhatsApp y web. Plataforma SaaS multi-tenant con motor de workflows de IA, ecommerce SSR, sistema de reservas inteligente e integraciones bidireccionales con CRMs. Orquestación de múltiples agentes especializados que ejecutan tareas de forma autónoma conectados a APIs internas y externas.",
    achievements: [
      "Agentes conversacionales autónomos con OpenAI API y function calling para ciclo completo de interacción",
      "Plataforma SaaS multi-tenant whitelabel con motor de workflows de IA, ecommerce SSR y panel admin",
      "Sistema de reservas con agente inteligente conectado a API externa de gestión de citas",
      "Integración bidireccional con GoHighLevel (CRM) vía OAuth multi-tenant y webhooks",
      "Integración con Meta e Instagram para mensajería automatizada",
      "Coordinación de agentes por áreas, con contexto persistente, revisión y evidencia de resultados",
      "Arquitectura de microservicios con Docker (6 containers: engine, frontend, ecommerce, booking, PostgreSQL, Redis)",
      "Academia online y sitio institucional con React, Next.js y SSR",
    ],
    tags: ["OpenAI API", "Anthropic Claude", "Function Calling", "MCP", "Node.js", "TypeScript", "React", "Next.js", "Fastify", "Docker", "n8n", "GHL", "GHL Marketplace"],
    metrics: [
      { label: "Contactos gestionados por IA", value: "2,800+" },
      { label: "Mensajes procesados", value: "40,000+" },
      { label: "Marcas en producción SaaS", value: "4" },
      { label: "Dominios activos", value: "28" },
    ],
  },
  {
    slug: "fullstack-cloud",
    title: "Software e infraestructura cloud",
    company: "Freelance / Enigma Developers",
    period: "2019–2024",
    badge: "Freelance",
    shortDescription:
      "Desarrollo web, infraestructura en AWS y automatización para proyectos en Latinoamérica y Europa.",
    fullDescription:
      "Desarrollo full stack para clientes en Latinoamérica y Europa, administración de infraestructura en AWS y medición de conversiones. Esta etapa reúne trabajo de interfaces, servicios, despliegue y operación que hoy aplico a productos con IA.",
    achievements: [
      "Landing pages con optimización de carga, experiencia móvil y accesibilidad",
      "Infraestructura AWS: EC2, RDS, CloudFront y Route53; preparación y verificación de migraciones",
      "Administración de servidores Linux, respaldos y monitoreo",
      "Temas WordPress custom con PHP, hooks avanzados y WooCommerce",
      "Tracking avanzado con GTM, GA4, mapas de calor (Clarity, Hotjar)",
      "Campañas Google Ads y Meta Ads con optimización continua de embudos",
      "SEO técnico, arquitectura de contenido y medición de búsquedas",
    ],
    tags: ["Node.js", "React", "WordPress", "PHP", "AWS", "Docker", "Linux", "SEO"],
    metrics: [
      { label: "Sitios construidos", value: "50+" },
      { label: "Servidores AWS", value: "30+" },
      { label: "PageSpeed promedio", value: "90+" },
      { label: "Países atendidos", value: "8+" },
    ],
  },
]

export function getExperienceBySlug(slug: string): ExperienceRole | undefined {
  return EXPERIENCE.find((e) => e.slug === slug)
}

export function getAllExperienceSlugs(): string[] {
  return EXPERIENCE.map((e) => e.slug)
}
