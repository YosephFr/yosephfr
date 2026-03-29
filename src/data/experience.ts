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
    title: "AI Engineering & Multi-Agent Systems",
    company: "Independent",
    period: "2025 - act",
    badge: "AI Engineer",
    shortDescription:
      "Agentes conversacionales autónomos con function calling, plataforma SaaS multi-tenant con motor de workflows de IA, sistema de reservas inteligente e integraciones bidireccionales con CRMs. 2,800+ contactos y 40,000+ mensajes procesados en producción.",
    fullDescription:
      "Diseño y construcción de sistemas de IA en producción real. Agentes conversacionales autónomos con function calling que gestionan ventas, soporte y operaciones vía WhatsApp y web. Plataforma SaaS multi-tenant con motor de workflows de IA, ecommerce SSR, sistema de reservas inteligente e integraciones bidireccionales con CRMs. Orquestación de múltiples agentes especializados que ejecutan tareas de forma autónoma conectados a APIs internas y externas.",
    achievements: [
      "Agentes conversacionales autónomos con OpenAI API y function calling para ciclo completo de interacción",
      "Plataforma SaaS multi-tenant whitelabel con motor de workflows de IA, ecommerce SSR y panel admin",
      "Sistema de reservas con agente inteligente conectado a API externa de gestión de citas",
      "Integración bidireccional con GoHighLevel (CRM) vía OAuth multi-tenant y webhooks",
      "Integración con Meta e Instagram para mensajería automatizada",
      "Orquestación multi-agente: agentes especializados que programan, deployean y ejecutan tareas de forma autónoma",
      "Arquitectura de microservicios con Docker (6 containers: engine, frontend, ecommerce, booking, PostgreSQL, Redis)",
      "Academia online y sitio institucional con React, Next.js y SSR",
    ],
    tags: ["OpenAI API", "Anthropic Claude", "Function Calling", "MCP", "Node.js", "TypeScript", "React", "Next.js", "Fastify", "Docker"],
    metrics: [
      { label: "Contactos gestionados por IA", value: "2,800+" },
      { label: "Mensajes procesados", value: "40,000+" },
      { label: "Marcas en producción SaaS", value: "4" },
      { label: "Dominios activos", value: "28" },
    ],
  },
  {
    slug: "fullstack-cloud",
    title: "Full Stack Development & Cloud Infrastructure",
    company: "Freelance / Enigma Developers",
    period: "2019 - 2024",
    badge: "Freelance",
    shortDescription:
      "+50 proyectos web para clientes en Latinoamérica y Europa. Desarrollo full stack, infraestructura cloud en AWS con 30+ servidores, y estrategias de conversión basadas en datos.",
    fullDescription:
      "+50 proyectos web para clientes en Latinoamérica y Europa. Desarrollo full stack, infraestructura cloud en AWS con 30+ servidores y zero downtime en migraciones, y estrategias de conversión basadas en datos. Esta etapa construyó la base de ingeniería y la visión de negocio que hoy aplico a sistemas con IA.",
    achievements: [
      "Landing pages con carga sub-2 segundos y PageSpeed >90 en mobile y desktop",
      "Infraestructura AWS completa: EC2, RDS, CloudFront, Route53, zero downtime en migraciones",
      "30+ servidores Linux administrados con backups automáticos y monitoreo continuo",
      "Temas WordPress custom con PHP, hooks avanzados y WooCommerce",
      "Tracking avanzado con GTM, GA4, mapas de calor (Clarity, Hotjar)",
      "Campañas Google Ads y Meta Ads con optimización continua de embudos",
      "SEO técnico que posicionó clientes en top 3 de Google",
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
