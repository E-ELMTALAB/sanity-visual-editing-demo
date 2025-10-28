interface ProductsOverlayProps {
  productsData: any[]
  faqsData: any[]
}

export default function ProductsOverlay({ productsData, faqsData }: ProductsOverlayProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      {productsData?.map((product, i) => (
        <div
          key={`product-${i}`}
          data-sanity-id={product?._id || `product-${i}`}
          data-sanity-type="product"
          data-sanity-index={i}
        >
          <span>{product?.name}</span>
          <span>{product?.description}</span>
          <span>{product?.price}</span>
          <span>{product?.originalPrice}</span>
          <span>{product?.category}</span>
          <span>{product?.rating}</span>
          <span>{product?.reviewCount}</span>
        </div>
      ))}
      {faqsData?.map((faq, i) => (
        <div
          key={`faq-${i}`}
          data-sanity-id={faq?._id || `faq-${i}`}
          data-sanity-type="faq"
          data-sanity-index={i}
        >
          <span>{faq?.question}</span>
          <span>{faq?.answer}</span>
        </div>
      ))}
    </div>
  )
}
