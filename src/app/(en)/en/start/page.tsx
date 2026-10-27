import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import StartLanding from '@/components/StartLanding'
import { articleDate, articlePath, getFeaturedArticles } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import { alternates } from '@/lib/lang'
import { jsonLd, og } from '@/lib/seo'

const title = 'Start here'
const description = 'Yoseph Franco designs AI agents, software and automations, and publishes what he tests. Weekly newsletter, model list cost and recent articles.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/en/start', languages: alternates('/empieza', '/en/start') },
  openGraph: og({ title: `${title} | ${PROFILE.brand}`, description, url: '/en/start', locale: 'en_US', alternateLocale: ['es_AR'] }),
  twitter: { card: 'summary_large_image', title: `${title} | ${PROFILE.brand}`, description, images: ['/og-arncof-v2.jpg'], creator: '@arncof' },
  robots: { index: true, follow: true },
}

export default function StartPage() {
  const articles = getFeaturedArticles('en', 4).map(article => ({
    title: article.title,
    description: article.description,
    category: article.category,
    when: articleDate(article.date, 'en'),
    minutes: `${article.readingMinutes} min read`,
    href: articlePath(article),
  }))
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PROFILE.url}/en/start#page`,
    url: `${PROFILE.url}/en/start`,
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': `${PROFILE.url}/#website` },
    about: { '@id': `${PROFILE.url}/#person` },
  }
  return (
    <>
      <StartLanding lang="en" articles={articles} schemaJson={jsonLd(schema)} />
      <Footer lang="en" />
    </>
  )
}
