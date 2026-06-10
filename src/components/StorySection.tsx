import type { SiteContent } from '../types'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'

interface StorySectionProps {
  content: SiteContent
}

export const StorySection = ({ content }: StorySectionProps) => (
  <Container className="accent-strip">
    <SectionHeading
      eyebrow="Karakter kelas"
      title="Bukan hanya teman sekelas."
      description="Kami bertumbuh sebagai ruang dukung, ruang bercanda, ruang berjuang, dan ruang mengingat."
    />

    <div className="three-column">
      <article className="accent-card accent-teal">
        <h3>Belajar bersama</h3>
        <p>
          Dari tugas individu sampai kerja kelompok, kami membentuk pola belajar yang semakin solid
          di setiap semester.
        </p>
      </article>
      <article className="accent-card accent-rose">
        <h3>Menjaga kebersamaan</h3>
        <p>
          Obrolan santai, candaan kelas, dan momen spontan adalah bagian yang membuat perjalanan ini
          terasa hangat.
        </p>
      </article>
      <article className="accent-card accent-lavender">
        <h3>Membuat arsip kenangan</h3>
        <p>
          Dokumentasi bukan sekadar file. Ia adalah bukti bahwa kami pernah melewati masa ini
          bersama-sama.
        </p>
      </article>
    </div>
  </Container>
)
