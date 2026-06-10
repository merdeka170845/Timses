import type { SiteContent } from '../types'
import { Container } from './Container'

interface StatsSectionProps {
  content: SiteContent
}

export const StatsSection = ({ content }: StatsSectionProps) => (
  <Container>
    <div className="stats-grid">
      {content.stats.map((item) => (
        <article key={item.label} className="content-card stat-card">
          <p className="stat-value">{item.value}</p>
          <h3>{item.label}</h3>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  </Container>
)
