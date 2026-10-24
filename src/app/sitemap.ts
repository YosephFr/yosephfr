import type { MetadataRoute } from 'next'
import { getPublicArticles } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import { EXPERIENCE } from '@/data/experience'
import { SKILLS } from '@/data/skills'
export const dynamic='force-static'
export default function sitemap(): MetadataRoute.Sitemap {
  const articles=getPublicArticles()
  const blogUpdated=new Date(Math.max(Date.parse(PROFILE.updated),...articles.map(article=>Date.parse(article.updated))))
  const paths=['','/en','/cv','/contacto','/blog','/en/blog',...EXPERIENCE.map(e=>`/experiencia/${e.slug}`),...SKILLS.map(s=>`/skills/${s.slug}`)]
  // Portada y blog existen en los dos idiomas: cada versión declara a la otra.
  const pairs:Record<string,{es:string;en:string}>={'':{es:'',en:'/en'},'/en':{es:'',en:'/en'},'/blog':{es:'/blog',en:'/en/blog'},'/en/blog':{es:'/blog',en:'/en/blog'}}
  const languages=(route:string)=>pairs[route]?{alternates:{languages:{es:PROFILE.url+(pairs[route].es||'/'),en:PROFILE.url+pairs[route].en}}}:{}
  return [...paths.map(route=>({url:PROFILE.url+route,lastModified:route.endsWith('/blog')?blogUpdated:new Date(PROFILE.updated),...languages(route)})),...articles.map(a=>({url:`${PROFILE.url}/blog/${a.slug}`,lastModified:new Date(a.updated)}))]
}
