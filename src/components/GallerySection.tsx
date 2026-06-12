import { useMemo, useState } from 'react'
import type { FolderPreviewItem, HighlightItem, SiteContent } from '../types'
import {
  buildBestDriveOpenUrl,
  buildDriveFolderEmbedUrl,
  buildDriveImageFallbackUrl,
  buildDriveImageUrl,
  buildDriveOpenUrl,
  buildDrivePreviewUrl,
  buildDriveUserContentImageUrl,
  buildDriveVideoThumbnailUrl,
  extractGoogleDriveId,
  isDriveFolderSource
} from '../lib/drive'
import { Container } from './Container'
import { SectionHeading } from './SectionHeading'

interface GallerySectionProps {
  content: SiteContent
}

interface DriveImagePreviewProps {
  fileId: string
  alt: string
  type: 'photo' | 'video'
}

const DriveImagePreview = ({ fileId, alt, type }: DriveImagePreviewProps) => {
  const sources = [
    type === 'photo' ? buildDriveImageUrl(fileId) : buildDriveVideoThumbnailUrl(fileId),
    buildDriveImageFallbackUrl(fileId),
    buildDriveUserContentImageUrl(fileId)
  ].filter(Boolean)
  const [sourceIndex, setSourceIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  if (!sources.length || failed) {
    return (
      <div className="placeholder-preview">
        <span>Google Drive</span>
      </div>
    )
  }

  return (
    <img
      src={sources[sourceIndex]}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => {
        if (sourceIndex < sources.length - 1) {
          setSourceIndex((v) => v + 1)
          return
        }
        setFailed(true)
      }}
    />
  )
}

const renderHighlightPreview = (item: HighlightItem, variant: 'selected' | 'folder' = 'selected') => {
  const source = item.driveSource ?? ''
  const driveId = item.driveFileId || extractGoogleDriveId(source)

  if (source && isDriveFolderSource(source) && driveId) {
    if (variant === 'folder') {
      return (
        <iframe
          src={buildDriveFolderEmbedUrl(driveId, 'grid')}
          title={item.title}
          loading="lazy"
        />
      )
    }
    if (item.type === 'photo') return <DriveImagePreview fileId={driveId} alt={item.title} type="photo" />
    return <DriveImagePreview fileId={driveId} alt={item.title} type="video" />
  }

  if ((item.type === 'photo' || item.type === 'video') && driveId) {
    if (item.type === 'photo') return <DriveImagePreview fileId={driveId} alt={item.title} type="photo" />
    return <DriveImagePreview fileId={driveId} alt={item.title} type="video" />
  }

  if (item.type === 'video' && driveId) {
    return (
      <iframe
        src={buildDrivePreviewUrl(driveId)}
        title={item.title}
        allow="autoplay; fullscreen"
        loading="lazy"
      />
    )
  }

  return (
    <div className="placeholder-preview">
      <span>Google Drive</span>
      <p>Tempel link file atau folder Google Drive untuk menampilkan preview di sini.</p>
    </div>
  )
}

// Renders a grid of selected folder preview items (admin-curated thumbnails)
const FolderSelectedGrid = ({
  items,
  folderUrl,
  type
}: {
  items: FolderPreviewItem[]
  folderUrl: string
  type: 'photo' | 'video'
}) => {
  if (!items.length) {
    return (
      <div className="folder-empty-state">
        <p>Belum ada {type === 'photo' ? 'foto' : 'video'} yang dipilih admin.</p>
        <p className="helper-text">Admin dapat memilih {type === 'photo' ? 'foto' : 'video'} di panel admin.</p>
        {folderUrl && (
          <a href={folderUrl} target="_blank" rel="noreferrer" className="primary-button" style={{ marginTop: 16 }}>
            Buka semua {type === 'photo' ? 'foto' : 'video'} di Google Drive
          </a>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="folder-preview-thumbnails">
        {items.map((item, index) => (
          <a
            key={`${item.driveFileId}-${index}`}
            href={buildDriveOpenUrl(item.driveFileId)}
            target="_blank"
            rel="noreferrer"
            className="folder-thumb-card"
            title={item.title}
          >
            <div className="folder-thumb-image">
              <DriveImagePreview fileId={item.driveFileId} alt={item.title} type={item.type} />
            </div>
            <p className="folder-thumb-title">{item.title}</p>
          </a>
        ))}
      </div>
      {folderUrl && (
        <div className="folder-drive-cta">
          <a href={folderUrl} target="_blank" rel="noreferrer" className="secondary-button">
            Lihat semua {type === 'photo' ? 'foto' : 'video'} di Google Drive →
          </a>
        </div>
      )}
    </div>
  )
}

export const GallerySection = ({ content }: GallerySectionProps) => {
  const [activeTab, setActiveTab] = useState<'selected' | 'photos' | 'videos'>('selected')

  const photoEmbedUrl = useMemo(
    () => buildDriveFolderEmbedUrl(content.photoFolderId || content.driveFolderId, 'grid'),
    [content.photoFolderId, content.driveFolderId]
  )

  const videoEmbedUrl = useMemo(
    () => buildDriveFolderEmbedUrl(content.videoFolderId || content.driveFolderId, 'grid'),
    [content.videoFolderId, content.driveFolderId]
  )

  const manualItems = content.highlights.filter((item) => item.type === 'photo' || item.type === 'video').slice(0, 2)

  const photoDisplayMode = content.photoFolderDisplayMode ?? 'all'
  const videoDisplayMode = content.videoFolderDisplayMode ?? 'all'
  const photoFolderItems = content.photoFolderItems ?? []
  const videoFolderItems = content.videoFolderItems ?? []

  return (
    <Container id="gallery">
      <SectionHeading
        eyebrow={content.galleryEyebrow}
        title={content.galleryTitle}
        description={content.galleryDescription}
      />

      <div className="gallery-mode-banner">
        <div>
          <p className="eyebrow">Tampilan dokumentasi</p>
          <h3>{content.galleryMode === 'manual' ? 'Konten pilihan admin' : 'Sinkron dari Google Drive'}</h3>
          <p>
            {content.galleryMode === 'manual'
              ? 'Halaman ini menampilkan dua sorotan dokumentasi yang dipilih langsung oleh admin: satu foto dan satu video. Untuk melihat semua arsip, buka Google Drive melalui tombol di bawah.'
              : 'Halaman ini menampilkan preview langsung dari folder foto dan video di Google Drive. Untuk melihat semua file, pengunjung tetap perlu membuka Google Drive.'}
          </p>
        </div>

        <div className="gallery-top-actions">
          <a className="secondary-button" href={content.photoFolderUrl} target="_blank" rel="noreferrer">
            Lihat semua foto
          </a>
          <a className="primary-button" href={content.videoFolderUrl} target="_blank" rel="noreferrer">
            Lihat semua video
          </a>
        </div>
      </div>

      <div className="tab-controls" role="tablist" aria-label="Galeri dokumentasi">
        <button
          type="button"
          className={activeTab === 'selected' ? 'tab-button active' : 'tab-button'}
          role="tab"
          aria-selected={activeTab === 'selected'}
          onClick={() => setActiveTab('selected')}
        >
          Konten terpilih
        </button>
        <button
          type="button"
          className={activeTab === 'photos' ? 'tab-button active' : 'tab-button'}
          role="tab"
          aria-selected={activeTab === 'photos'}
          onClick={() => setActiveTab('photos')}
        >
          Folder foto
        </button>
        <button
          type="button"
          className={activeTab === 'videos' ? 'tab-button active' : 'tab-button'}
          role="tab"
          aria-selected={activeTab === 'videos'}
          onClick={() => setActiveTab('videos')}
        >
          Folder video
        </button>
      </div>

      {activeTab === 'selected' ? (
        <div className="selected-grid">
          {manualItems.map((item, index) => {
            const destination =
              item.link ||
              buildBestDriveOpenUrl(item.driveSource ?? '', item.driveFileId) ||
              (item.driveFileId ? buildDriveOpenUrl(item.driveFileId) : '')

            return (
              <article key={`${item.title}-${index}`} className="content-card media-card">
                <div className="media-frame media-frame-selected">{renderHighlightPreview(item, 'selected')}</div>
                <div className="media-body">
                  <p className="eyebrow">{item.type === 'photo' ? 'Foto terpilih' : 'Video terpilih'}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {destination ? (
                    <a href={destination} target="_blank" rel="noreferrer">
                      Buka di Google Drive
                    </a>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      ) : activeTab === 'photos' ? (
        photoDisplayMode === 'selected' ? (
          // Admin-curated photo thumbnails
          <FolderSelectedGrid
            items={photoFolderItems}
            folderUrl={content.photoFolderUrl}
            type="photo"
          />
        ) : (
          // Full Drive embed
          <article className="drive-embed-card">
            <div className="drive-embed-header">
              <div>
                <p className="eyebrow">Folder foto</p>
                <h3>Preview arsip foto</h3>
              </div>
              <a href={content.photoFolderUrl} target="_blank" rel="noreferrer">
                Buka folder lengkap
              </a>
            </div>
            {photoEmbedUrl ? <iframe className="drive-embed" src={photoEmbedUrl} title="Folder foto" /> : null}
          </article>
        )
      ) : (
        videoDisplayMode === 'selected' ? (
          // Admin-curated video thumbnails
          <FolderSelectedGrid
            items={videoFolderItems}
            folderUrl={content.videoFolderUrl}
            type="video"
          />
        ) : (
          // Full Drive embed
          <article className="drive-embed-card">
            <div className="drive-embed-header">
              <div>
                <p className="eyebrow">Folder video</p>
                <h3>Preview arsip video</h3>
              </div>
              <a href={content.videoFolderUrl} target="_blank" rel="noreferrer">
                Buka folder lengkap
              </a>
            </div>
            {videoEmbedUrl ? <iframe className="drive-embed" src={videoEmbedUrl} title="Folder video" /> : null}
          </article>
        )
      )}
    </Container>
  )
}
