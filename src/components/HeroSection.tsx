import type { SiteContent } from '../types'
import { Container } from './Container'

interface HeroSectionProps {
  content: SiteContent
}

export const HeroSection = ({ content }: HeroSectionProps) => (
  <Container id="home" className="hero-section">
    <div className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">{content.siteLabel} • {content.tagline}</p>
        <h1>{content.heroTitle}</h1>
        <p className="hero-description">{content.heroDescription}</p>

        <div className="hero-actions">
          <a className="primary-button" href="#gallery">
            {content.ctaPrimary}
          </a>
          <a className="secondary-button" href="#about">
            {content.ctaSecondary}
          </a>
        </div>
      </div>

      <aside className="hero-card hero-card-clean">
        <div className="hero-card-image hero-card-image--profile">
          <img src="/logo-timses.png" alt="Profil Tim Sukses" />
        </div>
        <div className="hero-card-body">
          <p className="eyebrow">Identitas kelompok</p>
          <h3>{content.groupName}</h3>
          <p>{content.intro}</p>
        </div>
      </aside>
    </div>
  </Container>
)
