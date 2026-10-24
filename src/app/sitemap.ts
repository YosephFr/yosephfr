import type { MetadataRoute } from 'next'
import { getPublicArticles } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import { EXPERIENCE } from '@/data/experience'
import { SKILLS } from '@/data/skills'
export const dynamic='force-static'
export default function sitemap(): MetadataRoute.Sitemap {
  const articles=getPublicArticles()
  const blogUpdated=new Date(Math.max(Date.parse(PROFILE.updated),...articles.map(article=>Date.parse(article.updated))))
  const paths=['','/cv','/contacto','/blog',...EXPERIENCE.map(e=>`/experiencia/${e.slug}`),...SKILLS.map(s=>`/skills/${s.slug}`)]
  return [...paths.map(route=>({url:PROFILE.url+route,lastModified:route==='/blog'?blogUpdated:new Date(PROFILE.updated)})),...articles.map(a=>({url:`${PROFILE.url}/blog/${a.slug}`,lastModified:new Date(a.updated)}))]
}
