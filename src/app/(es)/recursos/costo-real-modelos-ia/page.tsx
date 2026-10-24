import RealCostArticle from '@/components/RealCostArticle'
import { realCostMetadata } from '@/data/real-cost'

export const metadata = realCostMetadata('es')

export default function CostoRealPage() {
  return <RealCostArticle lang="es" />
}
