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
    slug: "automatizacion-ia-hernandez",
    title: "Automatizacion con IA & Desarrollo Full Stack",
    company: "Soc. Profesionales de Peluqueria Hernandez",
    period: "2024 - Presente",
    badge: "Full Stack",
    shortDescription:
      "Desarrollo de sistemas de automatizacion con inteligencia artificial, plataforma web con React y Next.js, academia online, y sistema de reservas integrado.",
    fullDescription:
      "Liderazgo tecnico completo en la transformacion digital de la organizacion. Diseñe e implemente un ecosistema de herramientas interconectadas: desde chatbots inteligentes con OpenAI API hasta una plataforma de cursos online y un sistema de reservas en tiempo real. Cada solucion fue construida con stack moderno — React, Next.js, Node.js, Express — priorizando escalabilidad y experiencia de usuario.",
    achievements: [
      "Diseño y desarrollo de sistema de automatizacion inteligente con Node.js y OpenAI API para atencion al cliente",
      "Sitio web institucional construido con React y Next.js, con SSR y optimizacion SEO",
      "Plataforma de academia online con sistema de cursos, progreso de estudiantes y contenido multimedia",
      "Sistema de reservas en tiempo real integrado con calendario y notificaciones automaticas",
      "Automatizacion de procesos internos que redujo carga operativa significativamente",
      "Integracion de multiples APIs de IA para generacion de contenido y atencion personalizada",
      "Arquitectura de microservicios con Docker para despliegue independiente de cada modulo",
    ],
    tags: ["Node.js", "React", "OpenAI API", "Next.js", "TypeScript", "Express", "Docker"],
    metrics: [
      { label: "Sistemas automatizados", value: "5+" },
      { label: "Reduccion operativa", value: "70%" },
      { label: "Plataformas desarrolladas", value: "4" },
      { label: "Integraciones IA", value: "3+" },
    ],
  },
  {
    slug: "desarrollo-web-wordpress",
    title: "Desarrollo Web & WordPress",
    company: "Freelance / Enigma Developers",
    period: "2019 - 2024",
    badge: "Freelance",
    shortDescription:
      "Mas de 50 sitios web construidos desde cero. Landing pages que cargan en menos de 2 segundos y convierten hasta 3x mas que el promedio de la industria.",
    fullDescription:
      "Lidere el desarrollo integral de proyectos web para clientes en toda Latinoamerica y Espana. Cada sitio fue diseñado con un enfoque obsesivo en rendimiento, conversion y escalabilidad. Desde landing pages de una sola pagina hasta ecosistemas WordPress complejos con WooCommerce, ACF y plugins custom. Mi trabajo no es solo construir sitios — es construir maquinas de conversion que generan resultados reales para el negocio.",
    achievements: [
      "Construi +50 sitios web desde cero, cada uno optimizado para conversion y rendimiento",
      "Landing pages con tiempos de carga inferiores a 2 segundos en mobile",
      "Consistentemente logre scores de PageSpeed Insights superiores al 90% en mobile y desktop",
      "Desarrolle temas WordPress completamente personalizados usando PHP, hooks y custom post types",
      "Cree una libreria de plantillas Elementor reutilizables que redujo tiempos de desarrollo en un 40%",
      "Implementacion rigurosa de mobile-first y responsive design en todos los proyectos",
      "Optimizacion SEO tecnica que posiciono multiples clientes en el top 3 de resultados de Google",
      "Tecnicas avanzadas de rendimiento: WebP, lazy load, compresion de imagenes, minificacion de assets",
    ],
    tags: ["WordPress", "Elementor Pro", "PHP", "WooCommerce", "ACF", "PageSpeed", "SEO"],
    metrics: [
      { label: "Sitios construidos", value: "50+" },
      { label: "PageSpeed promedio", value: "93" },
      { label: "Reduccion de carga", value: "60%" },
      { label: "Paises atendidos", value: "8+" },
    ],
  },
  {
    slug: "infraestructura-devops",
    title: "Infraestructura & DevOps",
    company: "Freelance / Enigma Developers",
    period: "2019 - 2025",
    badge: "Infraestructura",
    shortDescription:
      "Arquitectura cloud en AWS para proyectos de alto trafico. 30+ servidores administrados con zero downtime en migraciones criticas.",
    fullDescription:
      "Gestion completa de infraestructura cloud y servidores dedicados. Desde la configuracion inicial hasta el monitoreo continuo, asegurando que cada proyecto tenga la base tecnica solida que necesita para escalar. Migraciones complejas sin caidas, backups automatizados, y politicas de seguridad que protegen tanto los datos como la reputacion del cliente.",
    achievements: [
      "Configuracion y administracion de entornos de produccion en AWS (EC2, RDS, CloudFront, Route53)",
      "Gestion de +30 cuentas activas en servidores Linux con WHM/cPanel",
      "Implementacion de politicas de escalabilidad automatica y balanceo de carga",
      "Migraciones de sitios web criticos con zero downtime — sin perdida de datos",
      "Sistema de backups automaticos con rotacion y verificacion de integridad",
      "Certificados SSL automatizados y renovacion sin intervencion manual",
      "Monitoreo 24/7 de recursos del servidor con alertas proactivas",
    ],
    tags: ["AWS", "EC2", "RDS", "CloudFront", "Linux", "WHM/cPanel", "SSL/TLS", "Route53"],
    metrics: [
      { label: "Servidores gestionados", value: "30+" },
      { label: "Uptime promedio", value: "99.9%" },
      { label: "Migraciones exitosas", value: "100%" },
      { label: "Cuentas activas", value: "30+" },
    ],
  },
  {
    slug: "marketing-digital-cro",
    title: "Marketing Digital & CRO",
    company: "Freelance / Enigma Developers",
    period: "2019 - 2025",
    badge: "Marketing",
    shortDescription:
      "Estrategias de adquisicion y conversion que generan resultados medibles. Tracking avanzado, automatizacion de leads y optimizacion continua de embudos.",
    fullDescription:
      "No basta con construir un sitio bonito — tiene que generar negocio. Me especialice en el ciclo completo: desde la adquisicion de trafico con campañas paid, pasando por el tracking granular de cada interaccion, hasta la optimizacion obsesiva de cada paso del embudo. Cada decision basada en datos, cada cambio medido, cada resultado documentado.",
    achievements: [
      "Diseño y ejecucion de campañas en Google Ads y Facebook Ads con ROAS positivo",
      "Configuracion avanzada de tracking con Google Tag Manager y eventos custom",
      "Implementacion de Google Analytics 4 con funnels y conversion tracking",
      "Mapas de calor y grabaciones de sesion con Microsoft Clarity y Hotjar",
      "Automatizacion de flujos de leads via Webhooks hacia CRMs (Zoho, HubSpot)",
      "A/B testing continuo en landing pages para maximizar conversion",
      "Reportes ejecutivos mensuales con metricas de impacto real",
    ],
    tags: ["Google Ads", "Meta Ads", "GTM", "GA4", "Hotjar", "Clarity", "CRO", "Zoho"],
    metrics: [
      { label: "Campañas gestionadas", value: "100+" },
      { label: "Mejora en conversion", value: "3x" },
      { label: "Leads automatizados", value: "10K+" },
      { label: "ROAS promedio", value: "4.2x" },
    ],
  },
]

export function getExperienceBySlug(slug: string): ExperienceRole | undefined {
  return EXPERIENCE.find((e) => e.slug === slug)
}

export function getAllExperienceSlugs(): string[] {
  return EXPERIENCE.map((e) => e.slug)
}
