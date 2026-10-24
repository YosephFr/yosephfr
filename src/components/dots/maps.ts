import type { GlyphName } from './glyphs'

const WORK: Record<string, GlyphName> = { 'ai-engineering': 'agentes', 'fullstack-cloud': 'nube' }
const SKILL: Record<string, GlyphName> = { 'ai-agents': 'agentes', 'backend-apis': 'apis', 'frontend-react': 'interfaces', 'cloud-devops': 'nube' }

export const workGlyph = (slug: string): GlyphName => WORK[slug] ?? 'cv'
export const skillGlyph = (slug: string): GlyphName => SKILL[slug] ?? 'agentes'
