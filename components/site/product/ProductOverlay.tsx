interface ProductOverlayProps {
  product: any
  faqs?: any[]
  relatedProducts?: any[]
}

export default function ProductOverlay({ product, faqs, relatedProducts }: ProductOverlayProps) {
  if (!product) return null

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      <div
        data-sanity-id={product?._id}
        data-sanity-type="product"
      >
        <span>{product?.name}</span>
        <span>{product?.description}</span>
        <span>{product?.longDescription}</span>
        <span>{product?.category}</span>
        <span>{product?.price}</span>
        <span>{product?.originalPrice}</span>
        <span>{product?.discountPercentage}</span>
        <span>{product?.rating}</span>
        <span>{product?.reviewCount}</span>
        <span>{product?.relatedProducts?.length || 0}</span>
        <span>{product?.relatedBlogs?.length || 0}</span>
      </div>
      
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
      
      {/* Related Products Overlay */}
      {relatedProducts?.map((relProd, i) => (
        <div
          key={relProd._id}
          data-sanity-id={relProd._id}
          data-sanity-type="product"
          data-sanity-index={i}
        >
          <span>{relProd.name}</span>
          <span>{relProd.price}</span>
        </div>
      ))}
    </div>
  )
}


