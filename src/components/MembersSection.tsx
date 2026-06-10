import type { SiteContent } from '../types'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'

interface MembersSectionProps {
  content: SiteContent
}

export const MembersSection = ({ content }: MembersSectionProps) => (
  <Container id="members">
    <SectionHeading
      eyebrow="Anggota"
      title={`Kami berjumlah ${content.memberCount} orang.`}
      description={content.membersNote}
    />

    <div className="members-grid">
      {content.members.map((member, index) => (
        <article key={`${member.name}-${index}`} className="content-card member-card">
          <p className="member-index">{String(index + 1).padStart(2, '0')}</p>
          <h3>{member.name}</h3>
          <strong>{member.role}</strong>
          <p>{member.description}</p>
        </article>
      ))}
    </div>
  </Container>
)
