import type { FAQ } from 'types'

interface FAQOverlayProps {
  faqs: FAQ[]
}

export default function FAQOverlay({ faqs }: FAQOverlayProps) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }}>
      {faqs?.map((faq, i) => (
        <div
          key={`faq-${i}`}
          data-sanity-id={faq?._id}
          data-sanity-type="faq"
          data-sanity-index={i}
        >
          <span>{faq?.question}</span>
          <span>{faq?.answer}</span>
          <span>{faq?.category}</span>
          {faq?.tags?.map((tag, idx) => (
            <span key={idx}>{tag}</span>
          ))}
          {faq?.seo?.keywords?.map((keyword, idx) => (
            <span key={idx}>{keyword}</span>
          ))}
        </div>
      ))}
    </div>
  )
}
