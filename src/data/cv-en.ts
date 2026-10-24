// Versión en inglés del CV (/en/cv). Mismos hechos que experience.ts, education.ts y skills.ts; solo cambia el idioma.

export const EXPERIENCE_FULL_EN: Record<string, { fullDescription: string; achievements: string[] }> = {
  'ai-engineering': {
    fullDescription:
      'Design and construction of AI systems running in real production. Autonomous conversational agents with function calling that handle sales, support and operations over WhatsApp and the web. A multi-tenant SaaS platform with an AI workflow engine, SSR ecommerce, an intelligent booking system and two-way CRM integrations. Orchestration of multiple specialized agents that carry out tasks autonomously, connected to internal and external APIs.',
    achievements: [
      'Autonomous conversational agents with the OpenAI API and function calling for the full interaction cycle',
      'White-label multi-tenant SaaS platform with an AI workflow engine, SSR ecommerce and an admin panel',
      'Booking system with an intelligent agent connected to an external appointment API',
      'Two-way integration with GoHighLevel (CRM) through multi-tenant OAuth and webhooks',
      'Integration with Meta and Instagram for automated messaging',
      'Coordination of agents by area, with persistent context, review and evidence of results',
      'Microservices architecture with Docker (6 containers: engine, frontend, ecommerce, booking, PostgreSQL, Redis)',
      'Online academy and institutional website with React, Next.js and SSR',
    ],
  },
  'fullstack-cloud': {
    fullDescription:
      'Full stack development for clients in Latin America and Europe, AWS infrastructure administration and conversion measurement. This stage brings together interface, services, deployment and operations work that I now apply to AI products.',
    achievements: [
      'Landing pages optimized for load time, mobile experience and accessibility',
      'AWS infrastructure: EC2, RDS, CloudFront and Route53; preparing and verifying migrations',
      'Linux server administration, backups and monitoring',
      'Custom WordPress themes with PHP, advanced hooks and WooCommerce',
      'Advanced tracking with GTM, GA4 and heatmaps (Clarity, Hotjar)',
      'Google Ads and Meta Ads campaigns with continuous funnel optimization',
      'Technical SEO, content architecture and search measurement',
    ],
  },
}

export const PRACTICES_EN = [
  { title: 'Continuity between agents', text: 'Persistent context, a decision log and owners by area, so long jobs can be resumed without losing evidence.' },
  { title: 'Design reviewed in use', text: 'Reference research, adaptation to the product’s visual system and walkthroughs with real situations.' },
  { title: 'Traceable knowledge', text: 'Analysis of conversations and recordings, extraction of decisions and documentation with anonymized examples.' },
  { title: 'AI-assisted editorial production', text: 'Primary sources, scripts, media review and publishing control. Every delivery keeps its status and evidence.' },
]

// Clave: nombre en español de education.ts y skills.ts.
export const EDUCATION_EN: Record<string, { degree: string }> = {
  'Desarrollo web, contenido digital y recursos informáticos': { degree: 'Web development, digital content and IT resources' },
  'Ingeniería electrónica, robótica y mecatrónica': { degree: 'Electronic, robotics and mechatronics engineering' },
}
export const CERTIFICATIONS_EN: Record<string, { name: string; date?: string }> = {
  'Inglés Intermedio B1': { name: 'Intermediate English B1' },
  'HTML y CSS': { name: 'HTML and CSS' },
  'Full Stack con WordPress': { name: 'Full Stack with WordPress', date: 'Aug 2022' },
}
export const SKILL_ITEMS_EN: Record<string, string> = {
  'Orquestación y revisión de agentes': 'Agent orchestration and review',
  'Contexto persistente y trazabilidad': 'Persistent context and traceability',
}
