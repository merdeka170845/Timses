import type { SiteContent } from '../types'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'

interface QuotesSectionProps {
  content: SiteContent
}

export const QuotesSection = ({ content }: QuotesSectionProps) => (
  <Container>
    <SectionHeading
      eyebrow="Suara kami"
      title="Kalimat yang mewakili perjalanan ini."
      description="Silakan ganti kutipan ini dengan kalimat khas dari anggota kelas, slogan internal, atau caption paling ikonik."
    />

    <div className="quotes-grid">
      {content.quotes.map((quote, index) => (
        <article key={`${quote.name}-${index}`} className="content-card quote-card">
          <p className="quote-mark">“</p>
          <p>{quote.quote}</p>
          <strong>{quote.name}</strong>
          <span>{quote.role}</span>
        </article>
      ))}
    </div>
  </Container>
)
