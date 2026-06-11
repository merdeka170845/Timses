
import type { SiteContent } from '../types'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'

interface AboutSectionProps {
  content: SiteContent
}

export const AboutSection = ({ content }: AboutSectionProps) => (
  <Container id="about">
    <SectionHeading
      eyebrow={content.aboutEyebrow}
      title={content.aboutTitle}
      description={content.aboutDescription}
    />

    <div className="two-column">
      <article className="content-card">
        <h3>{content.aboutCardTitle}</h3>
        <p>{content.aboutText}</p>
      </article>

      <article className="content-card">
        <h3>{content.storyCardTitle}</h3>
        <p>{content.storyText}</p>
        <ul className="feature-list">
          {content.storyBullets.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </article>
    </div>
  </Container>
)
