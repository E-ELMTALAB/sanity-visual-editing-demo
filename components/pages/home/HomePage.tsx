import { ProjectListItem } from 'components/pages/home/ProjectListItem'
import HeroSlider from 'components/site/home/HeroSlider'
import PromoCard from 'components/site/home/PromoCard'
import { defaultHeroSlides, defaultPromoCards } from 'lib/defaults/homeHero'
import { Header } from 'components/shared/Header'
import Layout from 'components/shared/Layout'
import ScrollUp from 'components/shared/ScrollUp'
import { resolveHref } from 'lib/sanity.links'
import Link from 'next/link'
import type { HomePagePayload } from 'types'
import { SettingsPayload } from 'types'

import HomePageHead from './HomePageHead'

export interface HomePageProps {
  settings?: SettingsPayload
  page?: HomePagePayload
  preview?: boolean
}

export function HomePage({ page, settings, preview }: HomePageProps) {
  const { overview, showcaseProjects, title = 'Personal website', heroSlides, promoCards } = page ?? {}

  return (
    <>
      <HomePageHead page={page} settings={settings} />

      <Layout settings={settings} preview={preview}>
        <div className="space-y-20">
          {/* Hero section */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <HeroSlider slides={heroSlides && heroSlides.length > 0 ? heroSlides : defaultHeroSlides} />
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {(promoCards && promoCards.length > 0 ? promoCards : defaultPromoCards).slice(0, 2).map((card, i) => (
                <PromoCard key={i} card={card as any} />
              ))}
            </div>
          </div>

          {/* Header */}
          {title && <Header centered title={title} description={overview} />}
          {/* Showcase projects */}
          {showcaseProjects && showcaseProjects.length > 0 && (
            <div className="mx-auto max-w-[100rem] rounded-md border">
              {showcaseProjects.map((project, key) => {
                const href = resolveHref(project._type, project.slug)
                if (!href) {
                  return null
                }
                return (
                  <Link key={key} href={href}>
                    <ProjectListItem project={project} odd={key % 2} />
                  </Link>
                )
              })}
            </div>
          )}

          {/* Workaround: scroll to top on route change */}
          <ScrollUp />
        </div>
      </Layout>
    </>
  )
}
