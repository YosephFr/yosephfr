export interface SkillItem {
  name: string
  level: "expert" | "advanced" | "intermediate"
}

export interface SkillCategory {
  slug: string
  icon: string
  name: string
  color: string
  description: string
  badge: string
  items: SkillItem[]
  tools: string[]
  fullDescription: string
}

export const SKILLS: SkillCategory[] = [
  {
    slug: "ai-agents",
    icon: "AI",
    name: "IA y agentes",
    color: "bg-emerald-500/15 text-emerald-400",
    description: "Modelos, herramientas, MCP y coordinación con evidencia.",
    badge: "AI",
    items: [
      { name: "OpenAI API", level: "expert" },
      { name: "Anthropic Claude", level: "expert" },
      { name: "Function Calling", level: "expert" },
      { name: "MCP (Model Context Protocol)", level: "expert" },
      { name: "Agentic AI", level: "expert" },
      { name: "Orquestación y revisión de agentes", level: "advanced" },
      { name: "Contexto persistente y trazabilidad", level: "advanced" },
      { name: "Prompt Engineering", level: "expert" },
      { name: "LLM Integration", level: "expert" },
    ],
    tools: ["Codex", "Claude Code", "OpenAI Platform", "Anthropic Console", "LangChain", "Playwright", "tmux", "Docker"],
    fullDescription:
      "Agentes inteligentes con modelos de lenguaje, function calling, MCP y orquestación multi-agente. Diseño sistemas autónomos que gestionan procesos de negocio reales en producción: ventas conversacionales, soporte, reservas, clasificación de consultas y operaciones internas.",
  },
  {
    slug: "backend-apis",
    icon: "{}",
    name: "Servicios y APIs",
    color: "bg-orange-500/15 text-orange-400",
    description: "APIs, integraciones, datos y flujos de negocio.",
    badge: "BACKEND",
    items: [
      { name: "Node.js", level: "expert" },
      { name: "TypeScript", level: "expert" },
      { name: "Fastify", level: "expert" },
      { name: "Express", level: "expert" },
      { name: "REST APIs", level: "expert" },
      { name: "PostgreSQL", level: "expert" },
      { name: "Redis", level: "advanced" },
      { name: "BullMQ", level: "advanced" },
    ],
    tools: ["Docker", "PM2", "Drizzle", "Postman", "Insomnia", "GitHub Actions"],
    fullDescription:
      "APIs de alto rendimiento con Node.js y TypeScript. Integración de modelos de lenguaje con function tools, colas de mensajes, bases de datos y servicios externos. Arquitectura orientada a microservicios con Docker para entornos escalables y reproducibles.",
  },
  {
    slug: "frontend-react",
    icon: "<>",
    name: "Interfaces y diseño",
    color: "bg-blue-500/15 text-blue-400",
    description: "Productos claros, accesibles y probados en uso.",
    badge: "FRONTEND",
    items: [
      { name: "React", level: "expert" },
      { name: "Next.js", level: "expert" },
      { name: "TypeScript", level: "expert" },
      { name: "JavaScript ES6+", level: "expert" },
      { name: "HTML5/CSS3", level: "expert" },
      { name: "Tailwind CSS", level: "expert" },
      { name: "Framer Motion", level: "advanced" },
      { name: "Responsive Design", level: "expert" },
    ],
    tools: ["VS Code", "Git", "Chrome DevTools", "npm", "Vite", "Figma"],
    fullDescription:
      "Arquitectura de interfaces modernas con React y Next.js. Componentes reutilizables, state management avanzado, Server Components, y animaciones fluidas con Framer Motion. TypeScript como estándar en cada proyecto para mejorar la claridad y mantenibilidad del código.",
  },
  {
    slug: "cloud-devops",
    icon: "A",
    name: "Infraestructura cloud",
    color: "bg-amber-500/15 text-amber-400",
    description: "Despliegues, continuidad, respaldos y observabilidad.",
    badge: "INFRASTRUCTURE",
    items: [
      { name: "AWS (EC2, RDS, CloudFront)", level: "expert" },
      { name: "Docker", level: "advanced" },
      { name: "Linux Admin", level: "expert" },
      { name: "CI/CD", level: "advanced" },
      { name: "SSL/TLS", level: "expert" },
      { name: "DNS Management", level: "advanced" },
      { name: "WHM/cPanel", level: "expert" },
      { name: "Google Cloud", level: "advanced" },
    ],
    tools: ["AWS Console", "Docker", "SSH", "WHM", "Let's Encrypt", "Certbot", "GitHub Actions"],
    fullDescription:
      "Infraestructura cloud que escala. AWS para producción, Docker para entornos reproducibles, CI/CD con GitHub Actions, y administración de servidores Linux. Migraciones sin downtime, backups automatizados y certificados SSL renovados automáticamente.",
  },
]

export function getSkillBySlug(slug: string): SkillCategory | undefined {
  return SKILLS.find((s) => s.slug === slug)
}

export function getAllSkillSlugs(): string[] {
  return SKILLS.map((s) => s.slug)
}
