import RealCostArticle from '@/components/RealCostArticle'
import { realCostMetadata } from '@/data/real-cost'

export const metadata = realCostMetadata('en')

export default function RealCostPage() {
  return <RealCostArticle lang="en" />
}
