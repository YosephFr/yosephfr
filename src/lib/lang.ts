// Idioma de las páginas públicas. La versión en inglés vive bajo /en; los artículos, el CV y los detalles siguen en español.
export type Lang = 'es' | 'en'

export const isEnglishPath = (path: string) => path === '/en' || path.startsWith('/en/') || path === '/en.html'

export const UI = {
  es: {
    home: '/', blog: '/blog',
    nav: { home: 'Inicio', articles: 'Artículos', cv: 'CV', contact: 'Contacto', brand: 'Arncof, inicio' },
    hero: {
      title: 'IA que llega al trabajo real.',
      text: 'Construyo agentes, software y automatizaciones. Comparto lo que sirve para pasar de una idea a un producto que funciona.',
      caption: 'De una consulta a una tarea resuelta.',
      agents: 'Así trabajo con agentes',
    },
    process: {
      label: 'Cómo trabajo',
      steps: [
        { title: 'Entender', text: 'Qué necesita la persona.' },
        { title: 'Conectar', text: 'La información y las herramientas.' },
        { title: 'Comprobar', text: 'Que el resultado resuelve el pedido.' },
      ],
    },
    contact: {
      write: 'Escribir correo', copy: 'Copiar correo', copied: 'Copiado', selected: 'Correo seleccionado',
      copiedMessage: 'Correo copiado.', failedMessage: 'No se pudo copiar. El correo quedó seleccionado.',
    },
    articles: { heading: 'Ideas para trabajar mejor', all: 'Todos los artículos', minutes: 'min', inSpanish: 'en español' },
    experience: { heading: 'Del producto a la operación', cv: 'Ver CV' },
    skills: { heading: 'Cómo puedo ayudarte' },
    cta: { title: '¿Qué quieres construir?', text: 'Hablemos de tu producto, tu proceso o la tarea que necesitas resolver.' },
    footer: { tagline: 'Agentes de IA, software y automatización para el trabajo real.', sections: 'Secciones', profiles: 'Perfiles', other: 'English', otherHref: '/en' },
  },
  en: {
    home: '/en', blog: '/en/blog',
    nav: { home: 'Home', articles: 'Articles', cv: 'CV', contact: 'Contact', brand: 'Arncof, home' },
    hero: {
      title: 'AI that reaches real work.',
      text: 'I build agents, software and automations. I share what helps turn an idea into a product that works.',
      caption: 'From a request to a finished task.',
      agents: 'How I work with agents',
    },
    process: {
      label: 'How I work',
      steps: [
        { title: 'Understand', text: 'What the person needs.' },
        { title: 'Connect', text: 'The information and the tools.' },
        { title: 'Verify', text: 'That the result solves the request.' },
      ],
    },
    contact: {
      write: 'Send an email', copy: 'Copy email', copied: 'Copied', selected: 'Email selected',
      copiedMessage: 'Email copied.', failedMessage: 'Could not copy. The email is selected.',
    },
    articles: { heading: 'Ideas for better work', all: 'All articles', minutes: 'min read', inSpanish: 'in Spanish' },
    experience: { heading: 'From product to operations', cv: 'View CV' },
    skills: { heading: 'How I can help' },
    cta: { title: 'What do you want to build?', text: 'Let’s talk about your product, your process or the task you need solved.' },
    footer: { tagline: 'AI agents, software and automation for real work.', sections: 'Sections', profiles: 'Profiles', other: 'Español', otherHref: '/' },
  },
} as const

// Textos en inglés de las tarjetas de experiencia y capacidades; los detalles enlazan a las páginas en español.
export const EXPERIENCE_EN: Record<string, { title: string; company?: string; period?: string; shortDescription: string }> = {
  'ai-engineering': {
    title: 'AI engineering and agents',
    company: 'Independent',
    period: '2025–present',
    shortDescription: 'Agents for support, sales and operations; SaaS platforms, booking and CRM integrations. From flow design to running it in production.',
  },
  'fullstack-cloud': {
    title: 'Software and cloud infrastructure',
    shortDescription: 'Web development, AWS infrastructure and automation for projects in Latin America and Europe.',
  },
}

export const SKILLS_EN: Record<string, { name: string; description: string }> = {
  'ai-agents': { name: 'AI and agents', description: 'Models, tools, MCP and coordination with evidence.' },
  'backend-apis': { name: 'Services and APIs', description: 'APIs, integrations, data and business flows.' },
  'frontend-react': { name: 'Interfaces and design', description: 'Clear, accessible products tested in use.' },
  'cloud-devops': { name: 'Cloud infrastructure', description: 'Deployments, continuity, backups and observability.' },
}

// hreflang compartido por las páginas que existen en los dos idiomas.
export const alternates = (es: string, en: string) => ({ es, en, 'x-default': es })
