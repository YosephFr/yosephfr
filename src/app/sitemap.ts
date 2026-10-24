import type { MetadataRoute } from 'next'
import { articlePath, getPublicArticles, getTranslation, type Article } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import { EXPERIENCE } from '@/data/experience'
import { SKILLS } from '@/data/skills'
export const dynamic='force-static'
export default function sitemap(): MetadataRoute.Sitemap {
  const articles=[...getPublicArticles('es'),...getPublicArticles('en')]
  const blogUpdated=new Date(Math.max(Date.parse(PROFILE.updated),...articles.map(article=>Date.parse(article.updated))))
  const paths=['','/en','/cv','/en/cv','/contacto','/en/contact','/blog','/en/blog',...EXPERIENCE.map(e=>`/experiencia/${e.slug}`),...SKILLS.map(s=>`/skills/${s.slug}`)]
  // Portada, blog y artículos traducidos existen en los dos idiomas: cada versión declara a la otra.
  const pairs:Record<string,{es:string;en:string}>={'':{es:'',en:'/en'},'/en':{es:'',en:'/en'},'/blog':{es:'/blog',en:'/en/blog'},'/en/blog':{es:'/blog',en:'/en/blog'},'/cv':{es:'/cv',en:'/en/cv'},'/en/cv':{es:'/cv',en:'/en/cv'},'/contacto':{es:'/contacto',en:'/en/contact'},'/en/contact':{es:'/contacto',en:'/en/contact'}}
  const languages=(route:string)=>pairs[route]?{alternates:{languages:{es:PROFILE.url+pairs[route].es,en:PROFILE.url+pairs[route].en,'x-default':PROFILE.url+pairs[route].es}}}:{}
  // Pareja traducida: hreflang recíproco y x-default en español. Un original solo en inglés declara hreflang en, sin x-default.
  const articleLanguages=(a:Article)=>{const other=getTranslation(a);if(!other)return a.language==='en'?{alternates:{languages:{en:PROFILE.url+articlePath(a)}}}:{};const es=a.language==='es'?a:other;const en=a.language==='en'?a:other;return {alternates:{languages:{es:PROFILE.url+articlePath(es),en:PROFILE.url+articlePath(en),'x-default':PROFILE.url+articlePath(es)}}}}
  return [...paths.map(route=>({url:PROFILE.url+route,lastModified:route.endsWith('/blog')?blogUpdated:new Date(PROFILE.updated),...languages(route)})),...articles.map(a=>({url:PROFILE.url+articlePath(a),lastModified:new Date(a.updated),...articleLanguages(a)}))]
}
