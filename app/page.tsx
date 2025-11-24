import { draftMode } from 'next/headers'
import { getClient } from 'lib/sanity.client'
import { readToken } from 'lib/sanity.api'
import { sharifHeroQuery, settingsQuery } from 'lib/sanity.queries'
import { urlForImage } from 'lib/sanity.image'
import HeroPromoOverlay from 'components/site/home/HeroPromoOverlay'
import SharifHomePage from 'components/site/home/SharifHomePage'
import Layout from 'components/shared/Layout'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const isDraft = draftMode().isEnabled
    const client = getClient(isDraft ? { token: readToken } : undefined)
    const data = await client.fetch<any | null>(sharifHeroQuery)

    const seo = data?.seo || {}
    let ogImageUrl = undefined
    try {
      ogImageUrl = seo.openGraphImage ? urlForImage(seo.openGraphImage)?.url() : undefined
    } catch (error) {
      console.warn('Failed to generate OG image URL:', error)
    }

    return {
      title: seo.metaTitle || 'SharifGPT - خدمات هوش مصنوعی و آموزش',
      description: seo.metaDescription || 'بهترین خدمات هوش مصنوعی، دوره‌های آموزشی و محصولات دیجیتال',
      openGraph: {
        title: seo.openGraphTitle || seo.metaTitle || 'SharifGPT',
        description: seo.openGraphDescription || seo.metaDescription || 'بهترین خدمات هوش مصنوعی',
        images: ogImageUrl ? [{ url: ogImageUrl }] : [],
        type: 'website',
        url: 'https://sharifgpt.com',
        siteName: 'SharifGPT',
        locale: 'fa_IR',
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.openGraphTitle || seo.metaTitle || 'SharifGPT',
        description: seo.openGraphDescription || seo.metaDescription || 'بهترین خدمات هوش مصنوعی',
        images: ogImageUrl ? [ogImageUrl] : [],
      },
      alternates: {
        canonical: seo.canonicalUrl || 'https://sharifgpt.com',
      },
      robots: {
        index: seo.robotsMeta?.includes('noindex') ? false : true,
        follow: seo.robotsMeta?.includes('nofollow') ? false : true,
      },
    }
  } catch (error) {
    console.warn('Failed to generate metadata from Sanity:', error)
    return {
      title: 'SharifGPT - خدمات هوش مصنوعی و آموزش',
      description: 'بهترین خدمات هوش مصنوعی، دوره‌های آموزشی و محصولات دیجیتال',
    }
  }
}

export default async function RootPage() {
  const isDraft = draftMode().isEnabled
  const client = getClient(isDraft ? { token: readToken } : undefined)

  let data = null
  let settings = null

  try {
    // Fetch homepage data and settings
    [data, settings] = await Promise.all([
      client.fetch<any | null>(sharifHeroQuery),
      client.fetch<any | null>(settingsQuery),
    ])
  } catch (error) {
    console.warn('Failed to fetch Sanity data:', error)
    // Use empty data to prevent build failures
    data = { topBannerSlides: [], heroSlides: [], promoCards: [], discountedProducts: [], socialMediaProducts: [], educationalProducts: [], bestsellingCourses: [], magazinePosts: [], featuredBlogs: [] }
    settings = { menuItems: [], footer: [] }
  }
  
  // Convert Sanity image objects to URLs (with error handling)
  const processImages = (items: any[], imageField: string) => {
    return (items || []).map((item: any) => {
      try {
        const imageData = item[imageField]
        if (!imageData) {
          return { ...item, imageUrl: null }
        }
        
        const imageBuilder = urlForImage(imageData)
        if (!imageBuilder) {
          console.warn(`Invalid image data for ${imageField}:`, {
            hasAsset: !!imageData?.asset,
            assetRef: imageData?.asset?._ref,
            assetId: imageData?.asset?._id
          })
          return { ...item, imageUrl: null }
        }
        
        const imageUrl = imageBuilder.url()
        return { ...item, imageUrl }
      } catch (error) {
        console.warn(`Failed to process image for ${imageField}:`, error, item)
        return { ...item, imageUrl: null }
      }
    })
  }

  const topBannerSlides = processImages(data?.topBannerSlides, 'image')
  const heroSlides = processImages(data?.heroSlides, 'image')
  const promoCards = processImages(data?.promoCards, 'image')
  const discountedProducts = processImages(data?.discountedProducts, 'image')
  const socialMediaProducts = processImages(data?.socialMediaProducts, 'image')
  const educationalProducts = processImages(data?.educationalProducts, 'image')
  const bestsellingCourses = processImages(data?.bestsellingCourses, 'featuredImage')
  const magazinePosts = processImages(data?.magazinePosts, 'coverImage')
  const featuredBlogs = processImages(data?.featuredBlogs, 'coverImage')
  
  return (
    <Layout settings={settings} preview={isDraft}>
      <SharifHomePage
        topBannerSlides={topBannerSlides}
        heroSlides={heroSlides}
        promoCards={promoCards}
        discountedProducts={discountedProducts}
        socialMediaProducts={socialMediaProducts}
        educationalProducts={educationalProducts}
        bestsellingCourses={bestsellingCourses}
        magazinePosts={magazinePosts}
        featuredBlogs={featuredBlogs}
      />
      <HeroPromoOverlay
        topBannerSlides={topBannerSlides}
        heroSlides={heroSlides}
        promoCards={promoCards}
        discountedProducts={discountedProducts}
        socialMediaProducts={socialMediaProducts}
        educationalProducts={educationalProducts}
        bestsellingCourses={bestsellingCourses}
        magazinePosts={magazinePosts}
        featuredBlogs={featuredBlogs}
      />
    </Layout>
  )
}


