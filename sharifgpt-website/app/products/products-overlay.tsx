"use client"

import { useLiveQuery } from 'next-sanity/preview'
import { getClient } from '@/lib/sanity.client'
import { productsListQuery, faqsByPageQuery } from '@/lib/sanity.queries'

interface ProductsOverlayProps {
  productsData: any[]
  faqsData: any[]
}

export default function ProductsOverlay({ productsData, faqsData }: ProductsOverlayProps) {
  const client = getClient()
  
  const [liveProductsData] = useLiveQuery(productsListQuery, {}, { 
    client,
    initialData: productsData
  })
  
  const [liveFaqsData] = useLiveQuery(faqsByPageQuery, { pageLocation: 'products' }, { 
    client,
    initialData: faqsData
  })

  return null // This component only provides live data updates
}
