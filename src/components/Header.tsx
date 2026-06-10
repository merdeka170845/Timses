import { useEffect, useState } from 'react'

interface HeaderProps {
  onOpenAdmin: () => void
}

const links = [
  ['home', 'Beranda'],
  ['about', 'Tentang'],
  ['journey', 'Perjalanan'],
  ['gallery', 'Dokumentasi'],
  ['contact', 'Kontak']
] as const

export const Header = ({ onOpenAdmin }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-open', mobileOpen)
    return () => document.body.classList.remove('nav-open')
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header className={scrolled ? 'site-header scrolled' : 'site-header'}>
        <div className="container nav-wrap">
          <a href="#home" className="brand" onClick={closeMobile}>
            <img src="/logo-timses.png" alt="Logo Tim Sukses" />
            <div>
              <strong>Tim Sukses</strong>
              <span>Arsip perkenalan &amp; kenangan</span>
            </div>
          </a>

          <button
            type="button"
            className="nav-toggle"
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={mobileOpen ? 'site-nav open' : 'site-nav'} aria-label="Navigasi utama">
            {links.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={closeMobile}>
                {label}
              </a>
            ))}
          </nav>

          <button type="button" className="ghost-button admin-trigger" onClick={onOpenAdmin}>
            Admin
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <button type="button" className="mobile-nav-backdrop" aria-label="Tutup menu" onClick={closeMobile} />
      ) : null}
    </>
  )
}
