import type { CollectionPayload, ProductDoc } from 'types'

interface CollectionOverlayProps {
  collection: CollectionPayload | null
  products: ProductDoc[]
}

export default function CollectionOverlay({ collection, products }: CollectionOverlayProps) {
  if (!collection) return null

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}
    >
      {/* Collection metadata */}
      <div
        data-sanity-id={collection._id}
        data-sanity-type="collection"
      >
        <span>{collection.title}</span>
        <span>{collection.heroTitle}</span>
        <span>{collection.heroSubtitle}</span>
        <span>{collection.key}</span>
      </div>

      {/* FAQ Items */}
      {collection.faq?.map((item, i) => (
        <div
          key={`faq-${i}`}
          data-sanity-id={`${collection._id}.faq[${i}]`}
          data-sanity-type="collection.faq"
          data-sanity-index={i}
        >
          <span>{item.question}</span>
          <span>{item.answer}</span>
        </div>
      ))}

      {/* Products */}
      {products?.map((product, i) => (
        <div
          key={product._id || `product-${i}`}
          data-sanity-id={product._id}
          data-sanity-type="product"
          data-sanity-index={i}
        >
          <span>{product.name}</span>
          <span>{product.description}</span>
          <span>{product.category}</span>
          <span>{product.price}</span>
          <span>{product.originalPrice}</span>
          <span>{product.discountPercentage}</span>
          <span>{product.collectionType}</span>
        </div>
      ))}
    </div>
  )
}
