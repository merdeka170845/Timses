
import { useEffect, useState } from 'react'
import type { HighlightItem, SiteContent, TimelineItem } from '../types'
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
  onSave: (next: SiteContent) => void
  onReset: () => void
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
                placeholder="Masukkan password admin"
              />
            </label>
            <button type="button" className="primary-button" onClick={handleLogin}>
              Buka dashboard
            </button>
          </div>
        ) : (
          <div className="admin-content">
            <div className="admin-grid">
              <article className="admin-card">
                <h3>Teks utama website</h3>
                <label>
                  Nama kelompok
                  <input
                    value={draft.groupName}
                    onChange={(event) => setDraft((prev) => ({ ...prev, groupName: event.target.value }))}
                  />
                </label>
                <label>
                  Tagline
                  <input
                    value={draft.tagline}
                    onChange={(event) => setDraft((prev) => ({ ...prev, tagline: event.target.value }))}
                  />
                </label>
                <label>
                  Intro singkat
                  <textarea
                    rows={4}
                    value={draft.intro}
                    onChange={(event) => setDraft((prev) => ({ ...prev, intro: event.target.value }))}
                  />
                </label>
                <label>
                  Judul hero
                  <textarea
                    rows={4}
                    value={draft.heroTitle}
                    onChange={(event) => setDraft((prev) => ({ ...prev, heroTitle: event.target.value }))}
                  />
                </label>
                <label>
                  Deskripsi hero
                  <textarea
                    rows={5}
                    value={draft.heroDescription}
                    onChange={(event) => setDraft((prev) => ({ ...prev, heroDescription: event.target.value }))}
                  />
                </label>
                <label>
                  Teks tombol utama
                  <input
                    value={draft.ctaPrimary}
                    onChange={(event) => setDraft((prev) => ({ ...prev, ctaPrimary: event.target.value }))}
                  />
                </label>
                <label>
                  Teks tombol kedua
                  <input
                    value={draft.ctaSecondary}
                    onChange={(event) => setDraft((prev) => ({ ...prev, ctaSecondary: event.target.value }))}
                  />
                </label>
              </article>

              <article className="admin-card">
                <h3>Tentang, footer & kontak</h3>
                <label>
                  Label section tentang
                  <input
                    value={draft.aboutEyebrow}
                    onChange={(event) => setDraft((prev) => ({ ...prev, aboutEyebrow: event.target.value }))}
                  />
                </label>
                <label>
                  Judul section tentang
                  <input
                    value={draft.aboutTitle}
                    onChange={(event) => setDraft((prev) => ({ ...prev, aboutTitle: event.target.value }))}
                  />
                </label>
                <label>
                  Deskripsi section tentang
                  <textarea
                    rows={3}
                    value={draft.aboutDescription}
                    onChange={(event) => setDraft((prev) => ({ ...prev, aboutDescription: event.target.value }))}
                  />
                </label>
                <label>
                  Judul kartu kiri
                  <input
                    value={draft.aboutCardTitle}
                    onChange={(event) => setDraft((prev) => ({ ...prev, aboutCardTitle: event.target.value }))}
                  />
                </label>
                <label>
                  Isi kartu kiri
                  <textarea
                    rows={5}
                    value={draft.aboutText}
                    onChange={(event) => setDraft((prev) => ({ ...prev, aboutText: event.target.value }))}
                  />
                </label>
                <label>
                  Judul kartu kanan
                  <input
                    value={draft.storyCardTitle}
                    onChange={(event) => setDraft((prev) => ({ ...prev, storyCardTitle: event.target.value }))}
                  />
                </label>
                <label>
                  Isi kartu kanan
                  <textarea
                    rows={5}
                    value={draft.storyText}
                    onChange={(event) => setDraft((prev) => ({ ...prev, storyText: event.target.value }))}
                  />
                </label>
                <label>
                  Poin singkat (satu baris per poin)
                  <textarea
                    rows={4}
                    value={draft.storyBullets.join('\n')}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        storyBullets: event.target.value
                          .split('\n')
                          .map((item) => item.trim())
                          .filter(Boolean)
                      }))
                    }
                  />
                </label>
                <label>
                  Judul footer
                  <textarea
                    rows={3}
                    value={draft.footerTitle}
                    onChange={(event) => setDraft((prev) => ({ ...prev, footerTitle: event.target.value }))}
                  />
                </label>
                <label>
                  Deskripsi footer
                  <textarea
                    rows={4}
                    value={draft.footerDescription}
                    onChange={(event) => setDraft((prev) => ({ ...prev, footerDescription: event.target.value }))}
                  />
                </label>
                <label>
                  Email kontak
                  <input
                    type="email"
                    value={draft.contactEmail}
                    onChange={(event) => setDraft((prev) => ({ ...prev, contactEmail: event.target.value }))}
                  />
                </label>
                <label>
                  Link Instagram
                  <input
                    value={draft.instagramUrl}
                    onChange={(event) => setDraft((prev) => ({ ...prev, instagramUrl: event.target.value }))}
                  />
                </label>
                <label>
                  Link TikTok
                  <input
                    value={draft.tiktokUrl}
                    onChange={(event) => setDraft((prev) => ({ ...prev, tiktokUrl: event.target.value }))}
                  />
                </label>
              </article>
            </div>

            <div className="admin-grid">
              <article className="admin-card">
                <h3>Perjalanan kelas</h3>
                <label>
                  Label section perjalanan
                  <input
                    value={draft.journeyEyebrow}
                    onChange={(event) => setDraft((prev) => ({ ...prev, journeyEyebrow: event.target.value }))}
                  />
                </label>
                <label>
                  Judul section perjalanan
                  <input
                    value={draft.journeyTitle}
                    onChange={(event) => setDraft((prev) => ({ ...prev, journeyTitle: event.target.value }))}
                  />
                </label>
                <label>
                  Deskripsi section perjalanan
                  <textarea
                    rows={3}
                    value={draft.journeyDescription}
                    onChange={(event) => setDraft((prev) => ({ ...prev, journeyDescription: event.target.value }))}
                  />
                </label>

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
                              timeline: prev.timeline.filter((_, itemIndex) => itemIndex !== index)
                            }))
                          }
                        >
                          Hapus
                        </button>
                      </div>
                      <label>
                        Label semester
                        <input
                          value={item.semester}
                          onChange={(event) => updateTimeline(index, { semester: event.target.value })}
                        />
                      </label>
                      <label>
                        Judul
                        <input
                          value={item.title}
                          onChange={(event) => updateTimeline(index, { title: event.target.value })}
                        />
                      </label>
                      <label>
                        Deskripsi
                        <textarea
                          rows={4}
                          value={item.description}
                          onChange={(event) => updateTimeline(index, { description: event.target.value })}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="ghost-button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      timeline: [...prev.timeline, emptyTimeline()]
                    }))
                  }
                >
                  Tambah cerita perjalanan
                </button>
              </article>

              <article className="admin-card">
                <h3>Pengaturan dokumentasi</h3>
                <label>
                  Label section dokumentasi
                  <input
                    value={draft.galleryEyebrow}
                    onChange={(event) => setDraft((prev) => ({ ...prev, galleryEyebrow: event.target.value }))}
                  />
                </label>
                <label>
                  Judul section dokumentasi
                  <textarea
                    rows={3}
                    value={draft.galleryTitle}
                    onChange={(event) => setDraft((prev) => ({ ...prev, galleryTitle: event.target.value }))}
                  />
                </label>
                <label>
                  Deskripsi section dokumentasi
                  <textarea
                    rows={4}
                    value={draft.galleryDescription}
                    onChange={(event) => setDraft((prev) => ({ ...prev, galleryDescription: event.target.value }))}
                  />
                </label>

                <div className="mode-switcher" role="radiogroup" aria-label="Pilih mode dokumentasi">
                  <button
                    type="button"
                    className={draft.galleryMode === 'manual' ? 'tab-button active' : 'tab-button'}
                    onClick={() => setDraft((prev) => ({ ...prev, galleryMode: 'manual' }))}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    className={draft.galleryMode === 'automatic' ? 'tab-button active' : 'tab-button'}
                    onClick={() => setDraft((prev) => ({ ...prev, galleryMode: 'automatic' }))}
                  >
                    Otomatis
                  </button>
                </div>

                <p className="helper-text">
                  Konten terpilih dibuat tetap dua kartu: satu foto dan satu video. Untuk menambah item lain, edit source code secara manual sebelum deploy.
                </p>

                <label>
                  Link folder utama Google Drive
                  <input
                    value={draft.driveFolderUrl}
                    onChange={(event) => updateFolder('driveFolderUrl', 'driveFolderId', event.target.value)}
                  />
                </label>
                <label>
                  Link folder foto
                  <input
                    value={draft.photoFolderUrl}
                    onChange={(event) => updateFolder('photoFolderUrl', 'photoFolderId', event.target.value)}
                  />
                </label>
                <label>
                  Link folder video
                  <input
                    value={draft.videoFolderUrl}
                    onChange={(event) => updateFolder('videoFolderUrl', 'videoFolderId', event.target.value)}
                  />
                </label>

                <div className="admin-folder-preview-grid">
                  <div className="folder-preview-card">
                    <p className="eyebrow">Preview folder foto</p>
                    <div className="folder-preview-frame">
                      {draft.photoFolderId ? (
                        <iframe
                          src={buildDriveFolderEmbedUrl(draft.photoFolderId, 'grid')}
                          title="Preview folder foto"
                        />
                      ) : (
                        <div className="placeholder-preview">
                          <span>Folder foto belum diisi</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="folder-preview-card">
                    <p className="eyebrow">Preview folder video</p>
                    <div className="folder-preview-frame">
                      {draft.videoFolderId ? (
                        <iframe
                          src={buildDriveFolderEmbedUrl(draft.videoFolderId, 'grid')}
                          title="Preview folder video"
                        />
                      ) : (
                        <div className="placeholder-preview">
                          <span>Folder video belum diisi</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <article className="admin-card admin-card-full">
              <div className="admin-card-top">
                <div>
                  <h3>Konten terpilih</h3>
                  <p className="helper-text">
                    Kartu sorotan dibatasi dua konten agar tampilan website lebih rapi: satu foto dan satu video.
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
                          onChange={(event) =>
                            updateHighlight(index, {
                              type: event.target.value as HighlightItem['type']
                            })
                          }
                        >
                          <option value="photo">Foto</option>
                          <option value="video">Video</option>
                        </select>
                      </label>

                      <label>
                        Judul
                        <input
                          value={item.title}
                          onChange={(event) => updateHighlight(index, { title: event.target.value })}
                        />
                      </label>

                      <label>
                        Deskripsi
                        <textarea
                          rows={4}
                          value={item.description}
                          onChange={(event) => updateHighlight(index, { description: event.target.value })}
                        />
                      </label>

                      <label>
                        Link file atau folder Google Drive
                        <input
                          value={item.driveSource ?? item.driveFileId ?? ''}
                          onChange={(event) =>
                            updateHighlight(index, {
                              driveSource: event.target.value,
                              driveFileId: extractGoogleDriveId(event.target.value)
                            })
                          }
                          placeholder="Tempel link file atau folder Google Drive"
                        />
                      </label>

                      <label>
                        Link tujuan saat diklik
                        <input
                          value={item.link ?? ''}
                          onChange={(event) => updateHighlight(index, { link: event.target.value })}
                          placeholder="Kosongkan untuk memakai link Drive yang sama"
                        />
                      </label>

                      <div className="inline-preview-actions">
                        {destination ? (
                          <a href={destination} target="_blank" rel="noreferrer" className="secondary-button">
                            Buka di Google Drive
                          </a>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="admin-card admin-card-full">
              <h3>Keamanan dashboard</h3>
              <p className="helper-text">
                Password default tetap bisa dipakai di semua browser yang belum diganti. Password baru yang kamu set di sini hanya tersimpan di browser admin ini.
              </p>
              <div className="admin-grid compact-grid">
                <label>
                  Password saat ini
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                  />
                </label>
                <label>
                  Password baru
                  <input
                    type="password"
                    value={nextPassword}
                    onChange={(event) => setNextPassword(event.target.value)}
                  />
                </label>
                <label>
                  Konfirmasi password baru
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </label>
              </div>
              <button type="button" className="secondary-button" onClick={handleChangePassword}>
                Ganti password admin
              </button>
            </article>

            <div className="admin-actions">
              <button type="button" className="primary-button" onClick={() => onSave({ ...draft, highlights: selectedHighlights })}>
                Simpan perubahan
              </button>
              <button type="button" className="secondary-button" onClick={() => setDraft(content)}>
                Batalkan perubahan
              </button>
              <div className="admin-actions-right">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => {
                    onReset()
                    setDraft(content)
                  }}
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
