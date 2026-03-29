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
    name: "AI & Agents",
    color: "bg-emerald-500/15 text-emerald-400",
    description: "OpenAI API, Anthropic Claude, Function Calling, MCP",
    badge: "AI",
    items: [
      { name: "OpenAI API", level: "expert" },
      { name: "Anthropic Claude", level: "expert" },
      { name: "Function Calling", level: "expert" },
      { name: "MCP (Model Context Protocol)", level: "expert" },
      { name: "Agentic AI", level: "expert" },
      { name: "Multi-Agent Orchestration", level: "advanced" },
      { name: "Prompt Engineering", level: "expert" },
      { name: "LLM Integration", level: "expert" },
    ],
    tools: ["OpenAI Platform", "Anthropic Console", "LangChain", "Playwright", "tmux", "Docker"],
    fullDescription:
      "Agentes inteligentes con modelos de lenguaje, function calling, MCP y orquestacion multi-agente. Diseno sistemas autonomos que gestionan procesos de negocio reales en produccion: ventas conversacionales, soporte, reservas, clasificacion de consultas y operaciones internas.",
  },
  {
    slug: "backend-apis",
    icon: "{}",
    name: "Backend & APIs",
    color: "bg-orange-500/15 text-orange-400",
    description: "Node.js, TypeScript, Fastify, PostgreSQL, Redis",
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
      "APIs de alto rendimiento con Node.js y TypeScript. Integracion de modelos de lenguaje con function tools, colas de mensajes, bases de datos y servicios externos. Arquitectura orientada a microservicios con Docker para entornos escalables y reproducibles.",
  },
  {
    slug: "frontend-react",
    icon: "<>",
    name: "Frontend & React",
    color: "bg-blue-500/15 text-blue-400",
    description: "React, Next.js, TypeScript, Tailwind CSS",
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
      "Arquitectura de interfaces modernas con React y Next.js. Componentes reutilizables, state management avanzado, Server Components, y animaciones fluidas con Framer Motion. TypeScript como estandar en cada proyecto para garantizar calidad y mantenibilidad del codigo.",
  },
  {
    slug: "cloud-devops",
    icon: "A",
    name: "Cloud & DevOps",
    color: "bg-amber-500/15 text-amber-400",
    description: "AWS, Docker, CI/CD, Linux Admin",
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
      "Infraestructura cloud que escala. AWS para produccion, Docker para entornos reproducibles, CI/CD con GitHub Actions, y administracion de servidores Linux. Migraciones sin downtime, backups automatizados y certificados SSL renovados automaticamente.",
  },
]

export function getSkillBySlug(slug: string): SkillCategory | undefined {
  return SKILLS.find((s) => s.slug === slug)
}

export function getAllSkillSlugs(): string[] {
  return SKILLS.map((s) => s.slug)
}
