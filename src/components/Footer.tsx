
interface FooterProps {
  email: string
  mainDriveUrl: string
  photoDriveUrl: string
  videoDriveUrl: string
  instagramUrl: string
  tiktokUrl: string
  title: string
  description: string
}

export const Footer = ({
  email,
  mainDriveUrl,
  photoDriveUrl,
  videoDriveUrl,
  instagramUrl,
  tiktokUrl,
  title,
  description
}: FooterProps) => (
  <footer className="site-footer" id="contact">
    <div className="container footer-grid">
      <div className="footer-copy">
        <p className="eyebrow">Tim Sukses</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="footer-links-wrap">
        <div className="footer-link-block">
          <p className="eyebrow">Dokumentasi</p>
          <a href={mainDriveUrl} target="_blank" rel="noreferrer">
            Buka folder utama Google Drive
          </a>
          <a href={photoDriveUrl} target="_blank" rel="noreferrer">
            Buka semua foto
          </a>
          <a href={videoDriveUrl} target="_blank" rel="noreferrer">
            Buka semua video
          </a>
        </div>

        <div className="footer-link-block">
          <p className="eyebrow">Kontak kami</p>
          <a href={`mailto:${email}`} className="footer-email">{email}</a>
          <div className="social-links" aria-label="Kontak sosial media Tim Sukses">
            <a
              className="social-link"
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Tim Sukses"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.88 1.62a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
              </svg>
            </a>

            <a
              className="social-link"
              href={tiktokUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok Tim Sukses"
              title="TikTok"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.53 2c.31 2.36 1.68 4.18 4.47 4.36v2.48a7.42 7.42 0 0 1-4.08-1.28v7.05A6.4 6.4 0 1 1 8.8 8.2v2.62a3.9 3.9 0 1 0 3.62 3.9V2h2.11Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
)
