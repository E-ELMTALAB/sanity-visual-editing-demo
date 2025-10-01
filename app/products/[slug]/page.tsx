import ProductPageClient from '../../../sharifgpt-website/app/products/[slug]/page'

export default function Page({ params }: { params: { slug: string } }) {
  return <ProductPageClient params={params} />
}
