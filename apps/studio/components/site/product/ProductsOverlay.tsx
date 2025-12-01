import type { ProductDoc } from 'types'

interface ProductsOverlayProps {
  products?: ProductDoc[]
  faqs?: any[]
}

export default function ProductsOverlay({ products, faqs }: ProductsOverlayProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      {products?.map((product, i) => (
        <div
          key={`product-${i}`}
          data-sanity-id={product?._id}
          data-sanity-type="product"
          data-sanity-index={i}
        >
          <span>{product?.name}</span>
          <span>{product?.description}</span>
          <span>{product?.category}</span>
          <span>{product?.price}</span>
          <span>{product?.originalPrice}</span>
          <span>{product?.discountPercentage}</span>
          <span>{product?.rating}</span>
          <span>{product?.reviewCount}</span>
          {product?.features?.map((feature, idx) => (
            <span key={idx}>{feature}</span>
          ))}
          {product?.badges?.map((badge, idx) => (
            <span key={idx}>{badge}</span>
          ))}
          {product?.tags?.map((tag, idx) => (
            <span key={idx}>{tag}</span>
          ))}
          {product?.seo?.metaTitle && <span>{product.seo.metaTitle}</span>}
          {product?.seo?.metaDescription && <span>{product.seo.metaDescription}</span>}
        </div>
      ))}
      
      {/* FAQs Overlay */}
      {faqs?.map((faq, i) => (
        <div
          key={faq._id}
          data-sanity-id={faq._id}
          data-sanity-type="faq"
          data-sanity-index={i}
        >
          <span>{faq.question}</span>
          <span>{faq.answer}</span>
          <span>{faq.category}</span>
        </div>
      ))}
    </div>
  )
}
