import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { faqsByPageQuery } from 'lib/sanity.queries'
import ContactPageClient from './page-client'
import ContactOverlay from 'components/site/contact/ContactOverlay'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'تماس با ما | SharifGPT',
  description: 'با تیم پشتیبانی SharifGPT در تلگرام در ارتباط باشید. پاسخگویی سریع 24/7',
}

export default async function ContactPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)
  
  // Fetch FAQs for contact page
  const faqs = await client.fetch<any[]>(faqsByPageQuery, { pageLocation: 'contact' })
  
  return (
    <>
      <ContactOverlay faqs={faqs} />
      <ContactPageClient faqsData={faqs} />
    </>
  )
}

