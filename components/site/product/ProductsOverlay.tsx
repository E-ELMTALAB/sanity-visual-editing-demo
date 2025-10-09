interface ProductsOverlayProps {
  faqs: any[]
}

export default function ProductsOverlay({ faqs }: ProductsOverlayProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
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
