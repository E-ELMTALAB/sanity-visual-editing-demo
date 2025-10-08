'use client'

import { BadgeCheck, Filter, Search, SlidersHorizontal, Sparkles, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { urlForImage } from 'lib/sanity.image'
import type { CollectionPayload, ProductDoc } from 'types'

const ITEMS_PER_PAGE = 24

type SortOption = 'popular' | 'price-low-high' | 'price-high-low' | 'newest'

type FacetKey = 'category' | 'features' | 'tags' | 'price'

type CollectionPageClientProps = {
  collection: CollectionPayload
  products: ProductDoc[]
  initialSearchParams?: Record<string, string | string[] | undefined>
}

type Translations = {
  home: string
  collections: string
  searchPlaceholder: string
  sortLabel: string
  filterLabel: string
  resetFilters: string
  emptyHeading: string
  emptyBody: string
  faqTitle: string
  newest: string
  priceLowHigh: string
  priceHighLow: string
  popular: string
  showFilters: string
  hideFilters: string
  ratingLabel: string
  perMonth: string
  perYear: string
  perStudent: string
  perLifetime: string
  priceFree: string
  viewDetails: string
  newBadge: string
  startingAt: string
  paginationPrev: string
  paginationNext: string
  productsCount: (count: number) => string
  categoryFacet: string
  featureFacet: string
  tagsFacet: string
  priceFacet: string
}

const translations: Record<'fa' | 'en', Translations> = {
  en: {
    home: 'Home',
    collections: 'Collections',
    searchPlaceholder: 'Search within this collection…',
    sortLabel: 'Sort',
    filterLabel: 'Filters',
    resetFilters: 'Reset filters',
    emptyHeading: 'No products match these filters',
    emptyBody: 'Try adjusting your filters or clear them to rediscover every chatbot assistant.',
    faqTitle: 'Frequently asked questions',
    newest: 'Newest',
    priceLowHigh: 'Price: Low → High',
    priceHighLow: 'Price: High → Low',
    popular: 'Popular',
    showFilters: 'Show filters',
    hideFilters: 'Hide filters',
    ratingLabel: 'rating',
    perMonth: 'mo',
    perYear: 'yr',
    perStudent: 'student',
    perLifetime: 'lifetime',
    priceFree: 'Free',
    viewDetails: 'View details',
    newBadge: 'New',
    startingAt: 'Starting at',
    paginationPrev: 'Previous',
    paginationNext: 'Next',
    productsCount: (count: number) => `${count} products`,
    categoryFacet: 'Category',
    featureFacet: 'Key features',
    tagsFacet: 'Tags',
    priceFacet: 'Price',
  },
  fa: {
    home: 'خانه',
    collections: 'مجموعه‌ها',
    searchPlaceholder: 'جستجو در این مجموعه…',
    sortLabel: 'مرتب‌سازی',
    filterLabel: 'فیلترها',
    resetFilters: 'حذف فیلترها',
    emptyHeading: 'محصولی با این فیلترها یافت نشد',
    emptyBody: 'فیلترها را تغییر دهید یا آن‌ها را حذف کنید تا دوباره همه دستیارها را ببینید.',
    faqTitle: 'سوالات متداول',
    newest: 'جدیدترین',
    priceLowHigh: 'قیمت: کم به زیاد',
    priceHighLow: 'قیمت: زیاد به کم',
    popular: 'محبوب‌ترین',
    showFilters: 'نمایش فیلترها',
    hideFilters: 'بستن فیلترها',
    ratingLabel: 'امتیاز',
    perMonth: 'ماهانه',
    perYear: 'سالانه',
    perStudent: 'دانشجویی',
    perLifetime: 'همیشگی',
    priceFree: 'رایگان',
    viewDetails: 'جزئیات بیشتر',
    newBadge: 'جدید',
    startingAt: 'شروع از',
    paginationPrev: 'قبلی',
    paginationNext: 'بعدی',
    productsCount: (count: number) => `${count.toLocaleString('fa-IR')} محصول`,
    categoryFacet: 'دسته‌بندی',
    featureFacet: 'ویژگی‌ها',
    tagsFacet: 'برچسب‌ها',
    priceFacet: 'بازه قیمت',
  },
}

const priceBuckets = [
  { id: 'lt-100000', labelEn: '< 100,000', labelFa: 'کمتر از ۱۰۰,۰۰۰ تومان', min: 0, max: 100000 },
  { id: '100000-250000', labelEn: '100,000 – 250,000', labelFa: '۱۰۰,۰۰۰ تا ۲۵۰,۰۰۰ تومان', min: 100000, max: 250000 },
  { id: '250000-500000', labelEn: '250,000 – 500,000', labelFa: '۲۵۰,۰۰۰ تا ۵۰۰,۰۰۰ تومان', min: 250000, max: 500000 },
  { id: 'gt-500000', labelEn: '> 500,000', labelFa: 'بیش از ۵۰۰,۰۰۰ تومان', min: 500000, max: Infinity },
]

function useLocale(): 'fa' | 'en' {
  const [locale, setLocale] = useState<'fa' | 'en'>(() => 'fa')

  useEffect(() => {
    if (typeof document === 'undefined') return
    const lang = document.documentElement.lang?.toLowerCase() || 'fa'
    if (lang.startsWith('en')) {
      setLocale('en')
    } else {
      setLocale('fa')
    }
  }, [])

  return locale
}

function formatPrice(value: number, locale: 'fa' | 'en') {
  if (value === 0) {
    return translations[locale].priceFree
  }

  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/ /, ' ') + ' تومان'
}

function computeProductPrice(product: ProductDoc) {
  return product.price || 0
}

function countActiveFilters(filters: SelectedFacets) {
  return (
    filters.category.length + filters.features.length + filters.tags.length + filters.price.length
  )
}

type SelectedFacets = Record<FacetKey, string[]>

function CollectionProductCard({
  product,
  locale,
  t,
}: {
  product: ProductDoc
  locale: 'fa' | 'en'
  t: Translations
}) {
  const price = product.price || 0
  const originalPrice = product.originalPrice || 0
  const discountPercentage = product.discountPercentage || 0
  
  const priceLabel = price > 0 ? formatPrice(price, locale) : t.priceFree
  const imageUrl = product.image ? urlForImage(product.image)?.width(600).height(400).url() : '/placeholder.svg'

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.6)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(15,23,42,0.55)] dark:border-slate-800/60 dark:bg-slate-900"
    >
      <div className="relative h-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-70" />
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name || 'Product'}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 40vw, 90vw"
            className="object-cover opacity-80"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-slate-900/20 to-transparent" />
        <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-white">
              <p className="text-sm font-medium opacity-80">{product.category || 'محصول'}</p>
              <h3 className="text-lg font-semibold leading-tight">{product.name}</h3>
            </div>
          </div>
          {discountPercentage > 0 ? (
            <Badge className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              <Sparkles className="me-1 size-3.5" /> {discountPercentage}%
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {product.description || ''}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.features?.slice(0, 3).map((feature) => (
            <Badge key={feature} variant="secondary" className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {feature}
            </Badge>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {product.rating && product.reviewCount ? (
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t.ratingLabel}
                </p>
                <div className="flex items-center gap-1 text-slate-800 dark:text-slate-100">
                  <Star className="size-4 text-amber-400" fill="currentColor" />
                  <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({product.reviewCount.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')})</span>
                </div>
              </div>
            ) : <div />}
            <div className="text-right">
              {originalPrice > price && (
                <p className="text-xs text-slate-400 line-through">
                  {formatPrice(originalPrice, locale)}
                </p>
              )}
              <p className="text-lg font-semibold text-slate-900 dark:text-white">{priceLabel}</p>
            </div>
          </div>
          <Button
            asChild
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-all group-hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <Link href={`/products/${product.slug?.current || ''}`} aria-label={`${product.name} ${t.viewDetails}`}>
              <span>{t.viewDetails}</span>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

function FacetPopover({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'rounded-full border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-white',
            value.length > 0 && 'border-slate-900 text-slate-900',
          )}
        >
          <SlidersHorizontal className="me-2 size-4" />
          {label}
          {value.length > 0 ? (
            <span className="ms-2 rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
              {value.length}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 rounded-2xl border border-slate-200 p-4 shadow-xl">
        <div className="flex flex-col gap-3">
          {options.map((option) => {
            const checked = value.includes(option.value)
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-slate-200 hover:bg-slate-50"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(isChecked) => {
                    if (isChecked) {
                      onChange([...value, option.value])
                    } else {
                      onChange(value.filter((item) => item !== option.value))
                    }
                  }}
                />
                <span className="text-sm text-slate-700">{option.label}</span>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function MobileFilters({
  facets,
  selections,
  setSelections,
  t,
}: {
  facets: Record<FacetKey, { label: string; options: { value: string; label: string }[] }>
  selections: SelectedFacets
  setSelections: (next: SelectedFacets) => void
  t: Translations
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full rounded-full bg-slate-900 py-2 text-sm font-semibold text-white md:hidden">
          <Filter className="me-2 size-4" />
          {open ? t.hideFilters : t.showFilters}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[75vh] overflow-y-auto rounded-t-3xl bg-white p-6">
        <SheetHeader>
          <SheetTitle className="text-start text-lg font-semibold text-slate-900">{t.filterLabel}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-6">
          {(Object.keys(facets) as FacetKey[]).map((facetKey) => (
            <div key={facetKey} className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">{facets[facetKey].label}</h4>
              <div className="flex flex-col gap-3">
                {facets[facetKey].options.map((option) => {
                  const checked = selections[facetKey].includes(option.value)
                  return (
                    <label
                      key={option.value}
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
                    >
                      <span className="text-sm text-slate-700">{option.label}</span>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          setSelections({
                            ...selections,
                            [facetKey]: isChecked
                              ? [...selections[facetKey], option.value]
                              : selections[facetKey].filter((item) => item !== option.value),
                          })
                        }}
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            className="mt-4 rounded-full border-slate-200"
            onClick={() => {
              setSelections({ brand: [], features: [], billing: [], price: [] })
              setOpen(false)
            }}
          >
            {t.resetFilters}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  t,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  t: Translations
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="mx-auto flex w-full justify-center" aria-label="pagination">
      <ul className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <li>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-3"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            {t.paginationPrev}
          </Button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <Button
              variant={page === currentPage ? 'default' : 'ghost'}
              size="sm"
              className={cn('rounded-full px-3', page === currentPage ? 'bg-slate-900 text-white' : 'text-slate-600')}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          </li>
        ))}
        <li>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-3"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            {t.paginationNext}
          </Button>
        </li>
      </ul>
    </nav>
  )
}

export default function CollectionPageClient({
  collection,
  products,
  initialSearchParams,
}: CollectionPageClientProps) {
  const locale = useLocale()
  const t = translations[locale]
  const router = useRouter()
  const pathname = usePathname()

  const availableFacets = useMemo(
    (): Record<FacetKey, { label: string; options: { value: string; label: string }[] }> => {
      const categoryOptions = Array.from(
        new Set(products.map((product) => product.category).filter(Boolean))
      ).map((value) => ({
        value: value!,
        label: value!,
      }))

      const featureOptions = Array.from(
        new Set(products.flatMap((product) => product.features || [])),
      ).map((value) => ({ value, label: value }))

      const tagOptions = Array.from(
        new Set(products.flatMap((product) => product.tags || [])),
      ).map((value) => ({ value, label: value }))

      const priceOptions = priceBuckets.map((bucket) => ({
        value: bucket.id,
        label: locale === 'fa' ? bucket.labelFa : bucket.labelEn,
      }))

      return {
        category: { label: t.categoryFacet, options: categoryOptions },
        features: { label: t.featureFacet, options: featureOptions },
        tags: { label: t.tagsFacet, options: tagOptions },
        price: { label: t.priceFacet, options: priceOptions },
      }
    },
    [locale, products, t],
  )

  const parseArrayParam = (value?: string | string[]) => {
    if (!value) return []
    const raw = Array.isArray(value) ? value.join(',') : value
    return raw.split(',').filter(Boolean)
  }

  const [searchTerm, setSearchTerm] = useState(
    () => (typeof initialSearchParams?.q === 'string' ? initialSearchParams.q : ''),
  )
  const [sort, setSort] = useState<SortOption>(() => {
    const raw = initialSearchParams?.sort
    if (raw === 'price-low-high' || raw === 'price-high-low' || raw === 'newest' || raw === 'popular') {
      return raw
    }
    return 'popular'
  })
  const [selectedFacets, setSelectedFacets] = useState<SelectedFacets>(() => ({
    category: parseArrayParam(initialSearchParams?.category),
    features: parseArrayParam(initialSearchParams?.features),
    tags: parseArrayParam(initialSearchParams?.tags),
    price: parseArrayParam(initialSearchParams?.price),
  }))
  const [page, setPage] = useState(() => {
    const rawPage = initialSearchParams?.page
    const parsed = Array.isArray(rawPage) ? parseInt(rawPage[0] ?? '1', 10) : parseInt(rawPage ?? '1', 10)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
  })

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (sort !== 'popular') params.set('sort', sort)
    if (selectedFacets.category.length) params.set('category', selectedFacets.category.join(','))
    if (selectedFacets.features.length) params.set('features', selectedFacets.features.join(','))
    if (selectedFacets.tags.length) params.set('tags', selectedFacets.tags.join(','))
    if (selectedFacets.price.length) params.set('price', selectedFacets.price.join(','))
    if (page > 1) params.set('page', String(page))

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [searchTerm, sort, selectedFacets, page, pathname, router])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    return products.filter((product) => {
      if (normalizedSearch) {
        const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase()
        if (!haystack.includes(normalizedSearch)) return false
      }

      if (selectedFacets.category.length && product.category && !selectedFacets.category.includes(product.category)) {
        return false
      }

      if (
        selectedFacets.features.length &&
        (!product.features || !selectedFacets.features.every((feature) => product.features?.includes(feature)))
      ) {
        return false
      }

      if (
        selectedFacets.tags.length &&
        (!product.tags || !selectedFacets.tags.some((tag) => product.tags?.includes(tag)))
      ) {
        return false
      }

      if (selectedFacets.price.length) {
        const minPrice = computeProductPrice(product)
        const bucketMatch = selectedFacets.price.some((bucketId) => {
          const bucket = priceBuckets.find((item) => item.id === bucketId)
          if (!bucket) return false
          return minPrice >= bucket.min && minPrice < bucket.max
        })
        if (!bucketMatch) return false
      }

      return true
    })
  }, [products, searchTerm, selectedFacets])

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sort === 'popular') {
        return (b.reviewCount || 0) - (a.reviewCount || 0)
      }
      if (sort === 'price-low-high') {
        return computeProductPrice(a) - computeProductPrice(b)
      }
      if (sort === 'price-high-low') {
        return computeProductPrice(b) - computeProductPrice(a)
      }
      if (sort === 'newest') {
        return 0 // Can be based on _createdAt if needed
      }
      return 0
    })
  }, [filteredProducts, sort])

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  useEffect(() => {
    if (page !== currentPage) {
      setPage(currentPage)
    }
  }, [currentPage, page])

  const activeFilterCount = countActiveFilters(selectedFacets)

  const resetFilters = () => {
    setSelectedFacets({ category: [], features: [], tags: [], price: [] })
    setSearchTerm('')
    setSort('popular')
    setPage(1)
  }

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-white pb-16 pt-10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t.home}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/collections">{t.collections}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{collection.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-slate-950 text-white shadow-[0_40px_80px_-60px_rgba(15,23,42,0.7)]">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/60 to-slate-950" />
            {collection.coverImage ? (
              <Image
                src={urlForImage(collection.coverImage)?.width(1920).height(600).url() || ''}
                alt={`${collection.title} cover`}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-60"
              />
            ) : null}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.45),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(129,140,248,0.4),transparent_60%)]" />
          </div>
          <div className="relative z-10 flex flex-col gap-8 px-6 py-14 sm:px-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="mb-4 w-fit rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
                {collection.key}
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {collection.heroTitle || collection.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-7 text-white/80">
                {collection.heroSubtitle}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 rounded-3xl border border-white/10 bg-white/10 px-6 py-4 text-white/90 backdrop-blur-lg lg:items-end">
              <span className="text-sm uppercase tracking-[0.2em] text-white/60">{t.productsCount(products.length)}</span>
              <p className="text-3xl font-semibold text-white">
                {products.length.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')}
              </p>
            </div>
          </div>
        </section>

        <section className="relative mt-10">
          <div className="sticky top-16 z-20 mb-6 rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-lg backdrop-blur md:top-24 dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
                <div className="relative w-full md:max-w-xs">
                  <Input
                    value={searchTerm}
                    onChange={(event) => {
                      setSearchTerm(event.target.value)
                      setPage(1)
                    }}
                    placeholder={t.searchPlaceholder}
                    className="w-full rounded-full border-slate-200 bg-slate-50 py-2 pe-10 ps-10 text-sm text-slate-700 shadow-inner"
                  />
                  <Search className="pointer-events-none absolute inset-y-0 start-4 my-auto size-4 text-slate-400" />
                </div>
                <div className="hidden flex-1 flex-wrap items-center gap-2 md:flex">
                  <FacetPopover
                    label={availableFacets.category.label}
                    options={availableFacets.category.options}
                    value={selectedFacets.category}
                    onChange={(next) => {
                      setSelectedFacets((prev) => ({ ...prev, category: next }))
                      setPage(1)
                    }}
                  />
                  <FacetPopover
                    label={availableFacets.features.label}
                    options={availableFacets.features.options}
                    value={selectedFacets.features}
                    onChange={(next) => {
                      setSelectedFacets((prev) => ({ ...prev, features: next }))
                      setPage(1)
                    }}
                  />
                  <FacetPopover
                    label={availableFacets.tags.label}
                    options={availableFacets.tags.options}
                    value={selectedFacets.tags}
                    onChange={(next) => {
                      setSelectedFacets((prev) => ({ ...prev, tags: next }))
                      setPage(1)
                    }}
                  />
                  <FacetPopover
                    label={availableFacets.price.label}
                    options={availableFacets.price.options}
                    value={selectedFacets.price}
                    onChange={(next) => {
                      setSelectedFacets((prev) => ({ ...prev, price: next }))
                      setPage(1)
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MobileFilters
                  facets={availableFacets}
                  selections={selectedFacets}
                  setSelections={(next) => {
                    setSelectedFacets(next)
                    setPage(1)
                  }}
                  t={t}
                />
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t.sortLabel}
                  </span>
                  <Select
                    value={sort}
                    onValueChange={(value) => {
                      setSort(value as SortOption)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[160px] border-none bg-transparent text-sm font-semibold text-slate-700 shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-slate-200 bg-white shadow-xl">
                      <SelectItem value="popular">{t.popular}</SelectItem>
                      <SelectItem value="price-low-high">{t.priceLowHigh}</SelectItem>
                      <SelectItem value="price-high-low">{t.priceHighLow}</SelectItem>
                      <SelectItem value="newest">{t.newest}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {(Object.keys(selectedFacets) as FacetKey[]).flatMap((facetKey) =>
                  selectedFacets[facetKey].map((value) => (
                    <Badge
                      key={`${facetKey}-${value}`}
                      variant="secondary"
                      className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-700"
                    >
                      {availableFacets[facetKey].options.find((option) => option.value === value)?.label || value}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFacets((prev) => ({
                            ...prev,
                            [facetKey]: prev[facetKey].filter((item) => item !== value),
                          }))
                          setPage(1)
                        }}
                        className="text-slate-400 transition hover:text-slate-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )),
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ms-auto rounded-full text-xs font-semibold text-slate-600"
                  onClick={resetFilters}
                >
                  {t.resetFilters}
                </Button>
              </div>
            )}
          </div>

          {paginatedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center shadow-inner">
              <BadgeCheck className="mb-4 size-10 text-slate-400" />
              <h2 className="text-2xl font-semibold text-slate-800">{t.emptyHeading}</h2>
              <p className="mt-3 max-w-md text-sm text-slate-500">{t.emptyBody}</p>
              <Button className="mt-6 rounded-full" onClick={resetFilters}>
                {t.resetFilters}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <CollectionProductCard key={product.id} product={product} locale={locale} t={t} />
                ))}
              </div>
              <div className="mt-10">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(nextPage) => {
                    setPage(nextPage)
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  t={t}
                />
              </div>
            </>
          )}
        </section>

        {collection.faq && collection.faq.length > 0 ? (
          <section className="mt-16 rounded-[2.5rem] border border-slate-200 bg-white/70 p-8 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.7)] backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{t.faqTitle}</h2>
            <Accordion type="single" collapsible className="mt-6 space-y-4">
              {collection.faq.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/90 px-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/90"
                >
                  <AccordionTrigger className="px-2 py-4 text-start text-base font-semibold text-slate-900 dark:text-white">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ) : null}
      </div>
    </main>
  )
}
