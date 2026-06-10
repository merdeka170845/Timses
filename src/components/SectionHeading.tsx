interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
}

export const SectionHeading = ({ eyebrow, title, description }: SectionHeadingProps) => (
  <div className="section-heading">
    {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
    <h2>{title}</h2>
    {description ? <p className="section-description">{description}</p> : null}
  </div>
)
