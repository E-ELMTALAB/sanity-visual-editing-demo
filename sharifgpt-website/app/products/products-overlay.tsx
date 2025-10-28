"use client"

import { useQuery } from 'next-sanity'
import { getClient } from '@/lib/sanity.client'
import { productsListQuery, faqsByPageQuery } from '@/lib/sanity.queries'

interface ProductsOverlayProps {
  productsData: any[]
  faqsData: any[]
}

export default function ProductsOverlay({ productsData, faqsData }: ProductsOverlayProps) {
  const client = getClient()
  
  const { data: liveProductsData } = useQuery(productsListQuery, {}, { 
    client,
    initialData: productsData,
    enabled: true 
  })
  
  const { data: liveFaqsData } = useQuery(faqsByPageQuery, { pageLocation: 'products' }, { 
    client,
    initialData: faqsData,
    enabled: true 
  })

  return null // This component only provides live data updates
}
