interface ProductOverlayProps {
  product: any
}

export default function ProductOverlay({ product }: ProductOverlayProps) {
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
      </div>
    </div>
  )
}


