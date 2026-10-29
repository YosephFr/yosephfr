import RealCostArticle from '@/components/RealCostArticle'
import MetaViewContent from '@/components/MetaViewContent'
import { realCostCopy, realCostMetadata } from '@/data/real-cost'

export const metadata = realCostMetadata('es')

export default function CostoRealPage() {
  return (
    <>
      <MetaViewContent name={realCostCopy('es').title} type="resource" lang="es" />
      <RealCostArticle lang="es" />
    </>
  )
}
