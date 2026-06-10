import type { SiteContent } from '../types'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'

interface AboutSectionProps {
  content: SiteContent
}

export const AboutSection = ({ content }: AboutSectionProps) => (
  <Container id="about">
    <SectionHeading
      eyebrow="Tentang"
      title={content.aboutTitle}
      description="Website ini disusun agar terasa rapi, ringan, dan nyaman dibuka di HP, tablet, maupun laptop."
    />

    <div className="two-column">
      <article className="content-card">
        <h3>Siapa kami</h3>
        <p>{content.aboutText}</p>
      </article>

      <article className="content-card">
        <h3>Kenapa website ini dibuat</h3>
        <p>{content.storyText}</p>
        <ul className="feature-list">
          <li>Menyimpan dokumentasi kelas dalam satu tempat.</li>
          <li>Menjadi arsip digital jangka panjang yang mudah dibuka lagi.</li>
          <li>Menjaga privasi karena nama dan jumlah anggota tidak tampil di publik.</li>
        </ul>
      </article>
    </div>
  </Container>
)
