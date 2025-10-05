import { toPlainText } from '@portabletext/react'
import { SiteMeta } from 'components/global/SiteMeta'
import { PagePayload, SettingsPayload } from 'types'
import Head from 'next/head'

export interface PageHeadProps {
  title: string | undefined
  page: PagePayload | undefined
  settings: SettingsPayload | undefined
}

export default function PageHead({ title, page, settings }: PageHeadProps) {
  const seo = page?.seo || {}
  const overviewText = page?.overview ? toPlainText(page.overview) : ''
  const metaTitle = seo.metaTitle || page?.title || title
  const metaDescription = seo.metaDescription || overviewText
  const canonicalUrl = seo.canonicalUrl
  const robotsMeta = seo.robotsMeta || 'index,follow'
  
  return (
    <>
      <SiteMeta
        baseTitle={title}
        description={metaDescription}
        image={seo.openGraphImage || settings?.ogImage}
        title={metaTitle}
      />
      <Head>
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta name="robots" content={robotsMeta} />
        {seo.openGraphTitle && <meta property="og:title" content={seo.openGraphTitle} />}
        {seo.openGraphDescription && <meta property="og:description" content={seo.openGraphDescription} />}
        {seo.structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: seo.structuredData }}
          />
        )}
      </Head>
    </>
  )
}
