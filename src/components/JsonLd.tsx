import { PROFILE } from '@/data/profile'
// Contacto público único: el correo de PROFILE, sin teléfono ni dirección.
export default function JsonLd() {
  const data = {'@context':'https://schema.org','@graph':[
    {'@type':'Person','@id':`${PROFILE.url}/#person`,name:PROFILE.name,alternateName:PROFILE.brand,url:PROFILE.url,email:PROFILE.email,contactPoint:{'@type':'ContactPoint',contactType:'general',email:PROFILE.email,url:`${PROFILE.url}/contacto`,availableLanguage:['es','en']},image:`${PROFILE.url}/avatar.jpg`,jobTitle:'AI Engineer',description:PROFILE.description,sameAs:PROFILE.socials.map(s=>s.href),knowsAbout:['Agentes de IA','MCP','Orquestación de agentes','Desarrollo de software','Automatización','Diseño de interfaces','Infraestructura cloud']},
    {'@type':'WebSite','@id':`${PROFILE.url}/#website`,name:PROFILE.brand,url:PROFILE.url,inLanguage:['es','en'],publisher:{'@id':`${PROFILE.url}/#person`}}
  ]}
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\u003c')}}/>
}
