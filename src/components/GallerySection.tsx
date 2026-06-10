import { useMemo, useState } from 'react'
import type { HighlightItem, SiteContent } from '../types'
import { buildDriveFolderEmbedUrl, buildDriveImageUrl, buildDrivePreviewUrl } from '../lib/drive'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'

interface GallerySectionProps {
  content: SiteContent
}

const renderHighlightPreview = (item: HighlightItem) => {
  if (item.type === 'photo' && item.driveFileId) {
    return <img src={buildDriveImageUrl(item.driveFileId)} alt={item.title} />
  }

  if (item.type === 'video' && item.driveFileId) {
    return <iframe src={buildDrivePreviewUrl(item.driveFileId)} title={item.title} allow="autoplay" />
  }

  return (
    <div className="placeholder-preview">
      <span>Google Drive</span>
      <p>Tambahkan file ID untuk preview unggulan.</p>
    </div>
  )
}

export const GallerySection = ({ content }: GallerySectionProps) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'drive'>('featured')

  const driveEmbedUrl = useMemo(
    () => buildDriveFolderEmbedUrl(content.driveFolderId, 'grid'),
    [content.driveFolderId]
  )

  return (
    <Container id="gallery">
      <SectionHeading
        eyebrow="Dokumentasi"
        title="Foto dan video pilihan."
        description="Google Drive tetap menjadi pusat penyimpanan utama agar website tetap ringan saat di-deploy."
      />

      <div className="tab-controls" role="tablist" aria-label="Galeri dokumentasi">
        <button
          type="button"
          className={activeTab === 'featured' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('featured')}
        >
          Highlight pilihan
        </button>
        <button
          type="button"
          className={activeTab === 'drive' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('drive')}
        >
          Folder Drive live
        </button>
      </div>

      {activeTab === 'featured' ? (
        <div className="gallery-grid">
          {content.highlights.map((item, index) => (
            <article key={`${item.title}-${index}`} className="content-card media-card">
              <div className="media-frame">{renderHighlightPreview(item)}</div>
              <div className="media-body">
                <p className="eyebrow">{item.type === 'photo' ? 'Foto' : item.type === 'video' ? 'Video' : 'Drive'}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer">
                    Buka link
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <article className="drive-embed-card">
          <div className="drive-embed-header">
            <div>
              <p className="eyebrow">Folder utama</p>
              <h3>Dokumentasi live dari Google Drive</h3>
            </div>
            <a href={content.driveFolderUrl} target="_blank" rel="noreferrer">
              Buka folder
            </a>
          </div>
          <iframe className="drive-embed" src={driveEmbedUrl} title="Google Drive Tim Sukses" />
        </article>
      )}
    </Container>
  )
}
