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
    slug: "backend-apis",
    icon: "{}",
    name: "Backend & APIs",
    color: "bg-orange-500/15 text-orange-400",
    description: "Node.js, Express, REST APIs, OpenAI API",
    badge: "BACKEND",
    items: [
      { name: "Node.js", level: "expert" },
      { name: "Express", level: "expert" },
      { name: "REST APIs", level: "expert" },
      { name: "OpenAI API", level: "advanced" },
      { name: "PHP", level: "expert" },
      { name: "MySQL", level: "advanced" },
      { name: "PostgreSQL", level: "advanced" },
      { name: "Redis", level: "advanced" },
    ],
    tools: ["Postman", "Docker", "PM2", "Prisma", "Supabase", "Insomnia"],
    fullDescription:
      "Desarrollo de APIs robustas con Node.js y Express. Integracion de servicios de IA con OpenAI API, bases de datos relacionales y cache con Redis. Arquitectura orientada a microservicios y despliegue con Docker para entornos reproducibles.",
  },
  {
    slug: "wordpress-cms",
    icon: "W",
    name: "WordPress & CMS",
    color: "bg-sky-500/15 text-sky-400",
    description: "Temas, plugins, hooks, ACF, WooCommerce",
    badge: "CMS",
    items: [
      { name: "WordPress Core", level: "expert" },
      { name: "Elementor Pro", level: "expert" },
      { name: "WooCommerce", level: "advanced" },
      { name: "ACF Pro", level: "expert" },
      { name: "Custom Themes", level: "expert" },
      { name: "Plugin Development", level: "advanced" },
      { name: "WordPress Hooks", level: "expert" },
      { name: "Custom Post Types", level: "expert" },
    ],
    tools: ["WordPress", "Elementor", "WooCommerce", "ACF", "WPML", "Yoast SEO", "WP Rocket"],
    fullDescription:
      "Dominio completo del ecosistema WordPress. Desde instalaciones vanilla hasta arquitecturas complejas con custom post types, taxonomias avanzadas, y plugins desarrollados a medida. Elementor para landing pages de alto impacto con widgets personalizados y templates reutilizables.",
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
  {
    slug: "marketing-analytics",
    icon: "M",
    name: "Marketing & Analytics",
    color: "bg-violet-500/15 text-violet-400",
    description: "Google Ads, Meta Ads, GTM, Analytics",
    badge: "GROWTH",
    items: [
      { name: "Google Ads", level: "advanced" },
      { name: "Facebook / Meta Ads", level: "advanced" },
      { name: "Google Tag Manager", level: "expert" },
      { name: "Google Analytics 4", level: "expert" },
      { name: "Hotjar / Clarity", level: "advanced" },
      { name: "Adobe Photoshop", level: "intermediate" },
      { name: "Adobe Illustrator", level: "intermediate" },
      { name: "UX/UI Basics", level: "intermediate" },
    ],
    tools: ["Google Ads", "Meta Business Suite", "GTM", "GA4", "Hotjar", "Clarity", "Photoshop"],
    fullDescription:
      "El marketing digital conecta productos con usuarios reales. Campañas paid con tracking granular usando GTM, analisis de comportamiento con mapas de calor y grabaciones de sesion, y optimizacion continua de cada paso del embudo para maximizar conversiones. Cada decision respaldada por datos.",
  },
]

export function getSkillBySlug(slug: string): SkillCategory | undefined {
  return SKILLS.find((s) => s.slug === slug)
}

export function getAllSkillSlugs(): string[] {
  return SKILLS.map((s) => s.slug)
}
