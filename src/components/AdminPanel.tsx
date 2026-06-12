import { useEffect, useState } from 'react'
import type { FolderPreviewItem, HighlightItem, SiteContent, TimelineItem } from '../types'
import {
  buildBestDriveOpenUrl,
  buildDriveFolderEmbedUrl,
  buildDriveImageUrl,
  buildDriveVideoThumbnailUrl,
  extractGoogleDriveId,
  isDriveFolderSource
} from '../lib/drive'

interface AdminPanelProps {
  open: boolean
  onClose: () => void
  content: SiteContent
  onSave: (next: SiteContent) => void | Promise<void>
  onReset: () => void | Promise<void>
}

const PASSWORD_STORAGE_KEY = 'timses-admin-password-hash-v3'
const DEFAULT_PASSWORD_HASH = '4f7fcde3edc08bcc275c452a10046e28efb96113201bfc442235062aa0fcb458'

const getStoredHash = () => localStorage.getItem(PASSWORD_STORAGE_KEY) ?? DEFAULT_PASSWORD_HASH

const hashPassword = async (value: string) => {
  const data = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('')
}

const emptyTimeline = (): TimelineItem => ({
  semester: 'Semester baru',
  title: 'Judul cerita',
  description: 'Tuliskan cerita atau momen penting di sini.',
  highlight: ''
})

const emptyFolderItem = (type: 'photo' | 'video'): FolderPreviewItem => ({
  title: type === 'photo' ? 'Foto baru' : 'Video baru',
  driveFileId: '',
  type
})

const previewNode = (item: HighlightItem) => {
  const source = item.driveSource ?? ''
  const driveId = item.driveFileId || extractGoogleDriveId(source)

  if (!driveId) {
    return (
      <div className="placeholder-preview">
        <span>Preview belum tersedia</span>
        <p>Masukkan link Google Drive file atau folder untuk melihat preview langsung.</p>
      </div>
    )
  }

  if (source && isDriveFolderSource(source)) {
    return <iframe src={buildDriveFolderEmbedUrl(driveId, 'grid')} title={item.title} loading="lazy" />
  }

  if (item.type === 'photo') {
    return <img src={buildDriveImageUrl(driveId)} alt={item.title} loading="lazy" />
  }

  return <img src={buildDriveVideoThumbnailUrl(driveId)} alt={item.title} loading="lazy" />
}

const FolderItemsEditor = ({
  items,
  type,
  onChange
}: {
  items: FolderPreviewItem[]
  type: 'photo' | 'video'
  onChange: (items: FolderPreviewItem[]) => void
}) => {
  const updateItem = (index: number, patch: Partial<FolderPreviewItem>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onChange([...items, emptyFolderItem(type)])
  }

  return (
    <div className="folder-items-editor">
      <p className="helper-text" style={{ marginBottom: 12 }}>
        Masukkan link file Google Drive ({type === 'photo' ? 'foto' : 'video'}) yang ingin ditampilkan sebagai thumbnail.
        Pengunjung tetap diarahkan ke Drive untuk melihat file aslinya.
      </p>

      {items.length === 0 && (
        <p className="helper-text" style={{ fontStyle: 'italic', marginBottom: 12 }}>
          Belum ada item. Klik "Tambah" untuk mulai memilih {type === 'photo' ? 'foto' : 'video'}.
        </p>
      )}

      <div className="folder-items-list">
        {items.map((item, index) => (
          <div key={index} className="folder-item-row">
            <div className="folder-item-preview-small">
              {item.driveFileId ? (
                <img
                  src={type === 'photo' ? buildDriveImageUrl(item.driveFileId) : buildDriveVideoThumbnailUrl(item.driveFileId)}
                  alt={item.title}
                  loading="lazy"
                />
              ) : (
                <div className="placeholder-preview" style={{ height: '100%' }}>
                  <span style={{ fontSize: 11 }}>Preview</span>
                </div>
              )}
            </div>
            <div className="folder-item-fields">
              <label>
                Judul
                <input
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  placeholder="Judul foto/video"
                />
              </label>
              <label>
                Link file Google Drive
                <input
                  value={item.driveFileId ? `https://drive.google.com/file/d/${item.driveFileId}/view` : ''}
                  onChange={(e) => {
                    const id = extractGoogleDriveId(e.target.value)
                    updateItem(index, { driveFileId: id })
                  }}
                  placeholder="Paste link file Google Drive"
                />
              </label>
            </div>
            <button
              type="button"
              className="ghost-button ghost-danger folder-item-remove"
              onClick={() => removeItem(index)}
              title="Hapus item ini"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="ghost-button" onClick={addItem} style={{ marginTop: 8 }}>
        + Tambah {type === 'photo' ? 'foto' : 'video'}
      </button>
    </div>
  )
}

export const AdminPanel = ({ open, onClose, content, onSave, onReset }: AdminPanelProps) => {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [draft, setDraft] = useState<SiteContent>(content)
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    setDraft(content)
  }, [content])

  useEffect(() => {
    if (!open) {
      setPassword('')
      setCurrentPassword('')
      setNextPassword('')
      setConfirmPassword('')
    }
  }, [open])

  if (!open) return null

  const updateFolder = (
    fieldUrl: 'driveFolderUrl' | 'photoFolderUrl' | 'videoFolderUrl',
    fieldId: 'driveFolderId' | 'photoFolderId' | 'videoFolderId',
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      [fieldUrl]: value,
      [fieldId]: extractGoogleDriveId(value)
    }))
  }

  const updateHighlight = (index: number, patch: Partial<HighlightItem>) => {
    setDraft((prev) => ({
      ...prev,
      highlights: prev.highlights.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    }))
  }

  const updateTimeline = (index: number, patch: Partial<TimelineItem>) => {
    setDraft((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
    }))
  }

  const handleLogin = async () => {
    const hashed = await hashPassword(password)
    if (hashed !== getStoredHash() && hashed !== DEFAULT_PASSWORD_HASH) {
      alert('Password admin salah.')
      return
    }
    setIsUnlocked(true)
    setPassword('')
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !nextPassword || !confirmPassword) {
      alert('Lengkapi semua kolom password dulu.')
      return
    }
    if (nextPassword.length < 8) {
      alert('Password baru minimal 8 karakter.')
      return
    }
    if (nextPassword !== confirmPassword) {
      alert('Konfirmasi password baru tidak cocok.')
      return
    }
    const currentHash = await hashPassword(currentPassword)
    if (currentHash !== getStoredHash() && currentHash !== DEFAULT_PASSWORD_HASH) {
      alert('Password saat ini salah.')
      return
    }
    const nextHash = await hashPassword(nextPassword)
    localStorage.setItem(PASSWORD_STORAGE_KEY, nextHash)
    setCurrentPassword('')
    setNextPassword('')
    setConfirmPassword('')
    alert('Password admin berhasil diganti di browser ini.')
  }

  const selectedHighlights = (draft.highlights.length >= 2 ? draft.highlights : content.highlights).slice(0, 2)

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true">
      <div className="admin-panel">
        <button type="button" className="icon-close-button" onClick={onClose} aria-label="Tutup panel admin">
          ×
        </button>

        <div className="admin-header">
          <div>
            <p className="eyebrow">Admin panel</p>
            <h2>Kelola konten website</h2>
            <p className="helper-text">
              Semua teks dan sorotan dokumentasi di bawah ini bisa diubah langsung tanpa edit file website.
            </p>
          </div>
        </div>

        {!isUnlocked ? (
          <div className="admin-login">
            <p>
              Masukkan password admin untuk membuka dashboard. Panel ini dibuat agar admin bisa mengubah teks,
              mengganti folder Drive, dan melihat preview langsung sebelum menyimpan.
            </p>
            <label>
              Password admin
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') void handleLogin() }}
                placeholder="Masukkan password admin"
              />
            </label>
            <button type="button" className="primary-button" onClick={handleLogin}>
              Buka dashboard
            </button>
          </div>
        ) : (
          <div className="admin-content">

            {/* ── SECTION 1: HERO & TEKS UTAMA ── */}
            <div className="admin-section-title">
              <h3>Teks halaman utama</h3>
            </div>
            <div className="admin-grid">
              <article className="admin-card">
                <h3>Hero & identitas</h3>
                <label>
                  Label atas website (sebelum tagline)
                  <input value={draft.siteLabel ?? 'Website resmi arsip kelas'} onChange={(e) => setDraft((p) => ({ ...p, siteLabel: e.target.value }))} />
                </label>
                <label>
                  Nama kelompok
                  <input value={draft.groupName} onChange={(e) => setDraft((p) => ({ ...p, groupName: e.target.value }))} />
                </label>
                <label>
                  Tagline (eyebrow di hero)
                  <input value={draft.tagline} onChange={(e) => setDraft((p) => ({ ...p, tagline: e.target.value }))} />
                </label>
                <label>
                  Intro singkat (kartu profil)
                  <textarea rows={4} value={draft.intro} onChange={(e) => setDraft((p) => ({ ...p, intro: e.target.value }))} />
                </label>
                <label>
                  Judul hero (heading besar)
                  <textarea rows={4} value={draft.heroTitle} onChange={(e) => setDraft((p) => ({ ...p, heroTitle: e.target.value }))} />
                </label>
                <label>
                  Deskripsi hero
                  <textarea rows={5} value={draft.heroDescription} onChange={(e) => setDraft((p) => ({ ...p, heroDescription: e.target.value }))} />
                </label>
                <label>
                  Teks tombol utama (CTA 1)
                  <input value={draft.ctaPrimary} onChange={(e) => setDraft((p) => ({ ...p, ctaPrimary: e.target.value }))} />
                </label>
                <label>
                  Teks tombol kedua (CTA 2)
                  <input value={draft.ctaSecondary} onChange={(e) => setDraft((p) => ({ ...p, ctaSecondary: e.target.value }))} />
                </label>
              </article>

              <article className="admin-card">
                <h3>Section Tentang</h3>
                <label>
                  Label section (eyebrow)
                  <input value={draft.aboutEyebrow} onChange={(e) => setDraft((p) => ({ ...p, aboutEyebrow: e.target.value }))} />
                </label>
                <label>
                  Judul section tentang
                  <input value={draft.aboutTitle} onChange={(e) => setDraft((p) => ({ ...p, aboutTitle: e.target.value }))} />
                </label>
                <label>
                  Deskripsi section tentang
                  <textarea rows={3} value={draft.aboutDescription} onChange={(e) => setDraft((p) => ({ ...p, aboutDescription: e.target.value }))} />
                </label>
                <label>
                  Judul kartu kiri
                  <input value={draft.aboutCardTitle} onChange={(e) => setDraft((p) => ({ ...p, aboutCardTitle: e.target.value }))} />
                </label>
                <label>
                  Isi kartu kiri
                  <textarea rows={5} value={draft.aboutText} onChange={(e) => setDraft((p) => ({ ...p, aboutText: e.target.value }))} />
                </label>
                <label>
                  Judul kartu kanan
                  <input value={draft.storyCardTitle} onChange={(e) => setDraft((p) => ({ ...p, storyCardTitle: e.target.value }))} />
                </label>
                <label>
                  Isi kartu kanan
                  <textarea rows={5} value={draft.storyText} onChange={(e) => setDraft((p) => ({ ...p, storyText: e.target.value }))} />
                </label>
                <label>
                  Poin singkat (satu baris per poin)
                  <textarea
                    rows={4}
                    value={draft.storyBullets.join('\n')}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        storyBullets: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
                      }))
                    }
                  />
                </label>
              </article>
            </div>

            {/* ── SECTION 2: SECTION HEADINGS ── */}
            <div className="admin-section-title">
              <h3>Heading setiap section</h3>
            </div>
            <div className="admin-grid">
              <article className="admin-card">
                <h3>Section Perjalanan</h3>
                <label>
                  Label section (eyebrow)
                  <input value={draft.journeyEyebrow} onChange={(e) => setDraft((p) => ({ ...p, journeyEyebrow: e.target.value }))} />
                </label>
                <label>
                  Judul section
                  <input value={draft.journeyTitle} onChange={(e) => setDraft((p) => ({ ...p, journeyTitle: e.target.value }))} />
                </label>
                <label>
                  Deskripsi section
                  <textarea rows={3} value={draft.journeyDescription} onChange={(e) => setDraft((p) => ({ ...p, journeyDescription: e.target.value }))} />
                </label>
              </article>

              <article className="admin-card">
                <h3>Section Dokumentasi</h3>
                <label>
                  Label section (eyebrow)
                  <input value={draft.galleryEyebrow} onChange={(e) => setDraft((p) => ({ ...p, galleryEyebrow: e.target.value }))} />
                </label>
                <label>
                  Judul section
                  <textarea rows={3} value={draft.galleryTitle} onChange={(e) => setDraft((p) => ({ ...p, galleryTitle: e.target.value }))} />
                </label>
                <label>
                  Deskripsi section
                  <textarea rows={4} value={draft.galleryDescription} onChange={(e) => setDraft((p) => ({ ...p, galleryDescription: e.target.value }))} />
                </label>
              </article>
            </div>

            {/* ── SECTION 3: FOOTER & KONTAK ── */}
            <div className="admin-section-title">
              <h3>Footer & kontak</h3>
            </div>
            <div className="admin-grid">
              <article className="admin-card">
                <h3>Teks footer</h3>
                <label>
                  Judul footer
                  <textarea rows={3} value={draft.footerTitle} onChange={(e) => setDraft((p) => ({ ...p, footerTitle: e.target.value }))} />
                </label>
                <label>
                  Deskripsi footer
                  <textarea rows={4} value={draft.footerDescription} onChange={(e) => setDraft((p) => ({ ...p, footerDescription: e.target.value }))} />
                </label>
              </article>
              <article className="admin-card">
                <h3>Kontak & sosial media</h3>
                <label>
                  Email kontak
                  <input type="email" value={draft.contactEmail} onChange={(e) => setDraft((p) => ({ ...p, contactEmail: e.target.value }))} />
                </label>
                <label>
                  Link Instagram
                  <input value={draft.instagramUrl} onChange={(e) => setDraft((p) => ({ ...p, instagramUrl: e.target.value }))} />
                </label>
                <label>
                  Link TikTok
                  <input value={draft.tiktokUrl} onChange={(e) => setDraft((p) => ({ ...p, tiktokUrl: e.target.value }))} />
                </label>
              </article>
            </div>

            {/* ── SECTION 4: PERJALANAN / TIMELINE ── */}
            <div className="admin-section-title">
              <h3>Cerita perjalanan kelas</h3>
            </div>
            <article className="admin-card admin-card-full">
              <div className="stack-list">
                {draft.timeline.map((item, index) => (
                  <div key={`${item.semester}-${index}`} className="inline-editor">
                    <div className="inline-editor-head">
                      <strong>Cerita {index + 1}</strong>
                      <button
                        type="button"
                        className="ghost-button ghost-danger"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            timeline: prev.timeline.filter((_, i) => i !== index)
                          }))
                        }
                      >
                        Hapus
                      </button>
                    </div>
                    <label>
                      Label semester
                      <input value={item.semester} onChange={(e) => updateTimeline(index, { semester: e.target.value })} />
                    </label>
                    <label>
                      Judul
                      <input value={item.title} onChange={(e) => updateTimeline(index, { title: e.target.value })} />
                    </label>
                    <label>
                      Deskripsi
                      <textarea rows={4} value={item.description} onChange={(e) => updateTimeline(index, { description: e.target.value })} />
                    </label>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="ghost-button"
                style={{ marginTop: 12 }}
                onClick={() =>
                  setDraft((prev) => ({ ...prev, timeline: [...prev.timeline, emptyTimeline()] }))
                }
              >
                Tambah cerita perjalanan
              </button>
            </article>

            {/* ── SECTION 5: DOKUMENTASI / DRIVE ── */}
            <div className="admin-section-title">
              <h3>Pengaturan dokumentasi</h3>
            </div>
            <div className="admin-grid">
              <article className="admin-card">
                <h3>Folder Google Drive</h3>
                <div className="mode-switcher" role="radiogroup" aria-label="Pilih mode dokumentasi" style={{ marginBottom: 16 }}>
                  <button
                    type="button"
                    className={draft.galleryMode === 'manual' ? 'tab-button active' : 'tab-button'}
                    onClick={() => setDraft((p) => ({ ...p, galleryMode: 'manual' }))}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    className={draft.galleryMode === 'automatic' ? 'tab-button active' : 'tab-button'}
                    onClick={() => setDraft((p) => ({ ...p, galleryMode: 'automatic' }))}
                  >
                    Otomatis
                  </button>
                </div>
                <label>
                  Link folder utama Google Drive
                  <input value={draft.driveFolderUrl} onChange={(e) => updateFolder('driveFolderUrl', 'driveFolderId', e.target.value)} />
                </label>
                <label>
                  Link folder foto
                  <input value={draft.photoFolderUrl} onChange={(e) => updateFolder('photoFolderUrl', 'photoFolderId', e.target.value)} />
                </label>
                <label>
                  Link folder video
                  <input value={draft.videoFolderUrl} onChange={(e) => updateFolder('videoFolderUrl', 'videoFolderId', e.target.value)} />
                </label>

                <div className="admin-folder-preview-grid" style={{ marginTop: 16 }}>
                  <div className="folder-preview-card">
                    <p className="eyebrow">Preview folder foto</p>
                    <div className="folder-preview-frame">
                      {draft.photoFolderId ? (
                        <iframe src={buildDriveFolderEmbedUrl(draft.photoFolderId, 'grid')} title="Preview folder foto" />
                      ) : (
                        <div className="placeholder-preview"><span>Folder foto belum diisi</span></div>
                      )}
                    </div>
                  </div>
                  <div className="folder-preview-card">
                    <p className="eyebrow">Preview folder video</p>
                    <div className="folder-preview-frame">
                      {draft.videoFolderId ? (
                        <iframe src={buildDriveFolderEmbedUrl(draft.videoFolderId, 'grid')} title="Preview folder video" />
                      ) : (
                        <div className="placeholder-preview"><span>Folder video belum diisi</span></div>
                      )}
                    </div>
                  </div>
                </div>
              </article>

              <article className="admin-card">
                <h3>Mode tampilan folder foto</h3>
                <p className="helper-text" style={{ marginBottom: 12 }}>
                  Pilih apakah tab "Folder Foto" menampilkan semua foto langsung dari Drive, atau hanya foto-foto pilihan admin.
                </p>
                <div className="mode-switcher" role="radiogroup" style={{ marginBottom: 16 }}>
                  <button
                    type="button"
                    className={(draft.photoFolderDisplayMode ?? 'all') === 'all' ? 'tab-button active' : 'tab-button'}
                    onClick={() => setDraft((p) => ({ ...p, photoFolderDisplayMode: 'all' }))}
                  >
                    Tampilkan semua
                  </button>
                  <button
                    type="button"
                    className={(draft.photoFolderDisplayMode ?? 'all') === 'selected' ? 'tab-button active' : 'tab-button'}
                    onClick={() => setDraft((p) => ({ ...p, photoFolderDisplayMode: 'selected' }))}
                  >
                    Pilih sendiri
                  </button>
                </div>

                {(draft.photoFolderDisplayMode ?? 'all') === 'selected' && (
                  <FolderItemsEditor
                    items={draft.photoFolderItems ?? []}
                    type="photo"
                    onChange={(items) => setDraft((p) => ({ ...p, photoFolderItems: items }))}
                  />
                )}

                <div style={{ marginTop: 28, borderTop: '1px solid var(--line)', paddingTop: 24 }}>
                  <h3>Mode tampilan folder video</h3>
                  <p className="helper-text" style={{ marginBottom: 12 }}>
                    Pilih apakah tab "Folder Video" menampilkan semua video dari Drive, atau hanya yang dipilih admin.
                  </p>
                  <div className="mode-switcher" role="radiogroup" style={{ marginBottom: 16 }}>
                    <button
                      type="button"
                      className={(draft.videoFolderDisplayMode ?? 'all') === 'all' ? 'tab-button active' : 'tab-button'}
                      onClick={() => setDraft((p) => ({ ...p, videoFolderDisplayMode: 'all' }))}
                    >
                      Tampilkan semua
                    </button>
                    <button
                      type="button"
                      className={(draft.videoFolderDisplayMode ?? 'all') === 'selected' ? 'tab-button active' : 'tab-button'}
                      onClick={() => setDraft((p) => ({ ...p, videoFolderDisplayMode: 'selected' }))}
                    >
                      Pilih sendiri
                    </button>
                  </div>

                  {(draft.videoFolderDisplayMode ?? 'all') === 'selected' && (
                    <FolderItemsEditor
                      items={draft.videoFolderItems ?? []}
                      type="video"
                      onChange={(items) => setDraft((p) => ({ ...p, videoFolderItems: items }))}
                    />
                  )}
                </div>
              </article>
            </div>

            {/* ── SECTION 6: KONTEN TERPILIH (tab pertama) ── */}
            <div className="admin-section-title">
              <h3>Konten terpilih (tab "Konten Terpilih")</h3>
            </div>
            <article className="admin-card admin-card-full">
              <div className="admin-card-top" style={{ marginBottom: 16 }}>
                <div>
                  <p className="helper-text">
                    Dua kartu sorotan: satu foto dan satu video yang tampil di tab "Konten Terpilih".
                  </p>
                </div>
              </div>
              <div className="manual-items-grid">
                {selectedHighlights.map((item, index) => {
                  const destination = item.link || buildBestDriveOpenUrl(item.driveSource ?? '', item.driveFileId)
                  return (
                    <div key={`${item.title}-${index}`} className="manual-item-card">
                      <div className="manual-item-head">
                        <strong>{index === 0 ? 'Foto 1' : 'Video 1'}</strong>
                      </div>
                      <div className="admin-media-preview">
                        {previewNode(item)}
                      </div>
                      <label>
                        Tipe media
                        <select
                          value={item.type}
                          onChange={(e) => updateHighlight(index, { type: e.target.value as HighlightItem['type'] })}
                        >
                          <option value="photo">Foto</option>
                          <option value="video">Video</option>
                        </select>
                      </label>
                      <label>
                        Judul
                        <input value={item.title} onChange={(e) => updateHighlight(index, { title: e.target.value })} />
                      </label>
                      <label>
                        Deskripsi
                        <textarea rows={4} value={item.description} onChange={(e) => updateHighlight(index, { description: e.target.value })} />
                      </label>
                      <label>
                        Link file atau folder Google Drive
                        <input
                          value={item.driveSource ?? item.driveFileId ?? ''}
                          onChange={(e) =>
                            updateHighlight(index, {
                              driveSource: e.target.value,
                              driveFileId: extractGoogleDriveId(e.target.value)
                            })
                          }
                          placeholder="Tempel link file atau folder Google Drive"
                        />
                      </label>
                      <label>
                        Link tujuan saat diklik
                        <input
                          value={item.link ?? ''}
                          onChange={(e) => updateHighlight(index, { link: e.target.value })}
                          placeholder="Kosongkan untuk memakai link Drive yang sama"
                        />
                      </label>
                      {destination ? (
                        <a href={destination} target="_blank" rel="noreferrer" className="secondary-button">
                          Buka di Google Drive
                        </a>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </article>

            {/* ── SECTION 7: KEAMANAN ── */}
            <div className="admin-section-title">
              <h3>Keamanan dashboard</h3>
            </div>
            <article className="admin-card admin-card-full">
              <p className="helper-text" style={{ marginBottom: 16 }}>
                Password default tetap bisa dipakai di semua browser yang belum diganti. Password baru yang kamu set di sini hanya tersimpan di browser admin ini.
              </p>
              <div className="admin-grid compact-grid">
                <label>
                  Password saat ini
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </label>
                <label>
                  Password baru
                  <input type="password" value={nextPassword} onChange={(e) => setNextPassword(e.target.value)} />
                </label>
                <label>
                  Konfirmasi password baru
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </label>
              </div>
              <button type="button" className="secondary-button" onClick={handleChangePassword}>
                Ganti password admin
              </button>
            </article>

            {/* ── ACTIONS ── */}
            <div className="admin-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => onSave({ ...draft, highlights: selectedHighlights })}
              >
                Simpan perubahan
              </button>
              <button type="button" className="secondary-button" onClick={() => setDraft(content)}>
                Batalkan perubahan
              </button>
              <div className="admin-actions-right">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => { onReset(); setDraft(content) }}
                >
                  Reset default
                </button>
                <button type="button" className="ghost-button" onClick={onClose}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
