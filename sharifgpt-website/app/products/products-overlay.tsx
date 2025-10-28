"use client"

import { useQuery } from '@sanity/io/client'
import { productsListQuery, faqsByPageQuery } from '@/lib/sanity.queries'

interface ProductsOverlayProps {
  productsData: any[]
  faqsData: any[]
}

export default function ProductsOverlay({ productsData, faqsData }: ProductsOverlayProps) {
  const { data: liveProductsData } = useQuery(productsListQuery, {}, { 
    initialData: productsData,
    enabled: true 
  })
  
  const { data: liveFaqsData } = useQuery(faqsByPageQuery, { pageLocation: 'products' }, { 
    initialData: faqsData,
    enabled: true 
  })

  return null // This component only provides live data updates
}
