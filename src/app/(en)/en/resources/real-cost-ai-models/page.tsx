import RealCostArticle from '@/components/RealCostArticle'
import MetaViewContent from '@/components/MetaViewContent'
import { realCostCopy, realCostMetadata } from '@/data/real-cost'

export const metadata = realCostMetadata('en')

export default function RealCostPage() {
  return (
    <>
      <MetaViewContent name={realCostCopy('en').title} type="resource" lang="en" />
      <RealCostArticle lang="en" />
    </>
  )
}
