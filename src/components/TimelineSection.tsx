
import type { SiteContent } from '../types'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'

interface TimelineSectionProps {
  content: SiteContent
}

export const TimelineSection = ({ content }: TimelineSectionProps) => (
  <Container id="journey">
    <SectionHeading
      eyebrow={content.journeyEyebrow}
      title={content.journeyTitle}
      description={content.journeyDescription}
    />

    <div className="timeline">
      {content.timeline.map((item, index) => (
        <article key={`${item.semester}-${index}`} className="timeline-item">
          <div className="timeline-marker" />
          <div className="timeline-card">
            <p className="eyebrow">{item.semester}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  </Container>
)
