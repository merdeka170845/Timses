import type { ReactNode } from 'react'

interface ContainerProps {
  id?: string
  className?: string
  children: ReactNode
}

export const Container = ({ id, className = '', children }: ContainerProps) => (
  <section id={id} className={`section ${className}`.trim()}>
    <div className="container">{children}</div>
  </section>
)
