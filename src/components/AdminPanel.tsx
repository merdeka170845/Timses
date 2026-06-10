import { useEffect, useState } from 'react'
import type { SiteContent } from '../types'
import { extractGoogleDriveId } from '../lib/drive'

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

  const handleFolderLink = (value: string) => {
    setDraft((prev) => ({
      ...prev,
      driveFolderUrl: value,
      driveFolderId: extractGoogleDriveId(value)
    }))
  }

  const handleLogin = async () => {
    const hashed = await hashPassword(password)
    if (hashed === getStoredHash() || hashed === DEFAULT_PASSWORD_HASH) {
      setIsUnlocked(true)
      setPassword('')
      return
    }
    alert('Password admin salah.')
  }

  const handleChangePassword = async () => {
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

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true">
      <div className="admin-panel">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Admin panel</p>
            <h2>Kelola konten website</h2>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>
            Tutup
          </button>
        </div>

        {!isUnlocked ? (
          <div className="admin-login">
            <p>
              Masukkan password admin untuk membuka panel. Password tidak ditampilkan di halaman
              publik agar user biasa tidak bisa melihatnya.
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
              Buka mode admin
            </button>
          </div>
        ) : (
          <div className="admin-content">
            <div className="admin-grid">
              <article className="admin-card">
                <h3>Konten utama</h3>
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
                  Judul hero
                  <textarea
                    rows={3}
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
                  Tentang
                  <textarea
                    rows={5}
                    value={draft.aboutText}
                    onChange={(event) => setDraft((prev) => ({ ...prev, aboutText: event.target.value }))}
                  />
                </label>
              </article>

              <article className="admin-card">
                <h3>Google Drive & keamanan</h3>
                <label>
                  Link folder utama
                  <input value={draft.driveFolderUrl} onChange={(event) => handleFolderLink(event.target.value)} />
                </label>
                <p className="helper-text">
                  Password default tetap bisa dipakai di semua device. Password baru yang kamu set di sini berlaku di browser admin ini.
                </p>
                <label>
                  Password saat ini
                  <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                </label>
                <label>
                  Password baru
                  <input type="password" value={nextPassword} onChange={(event) => setNextPassword(event.target.value)} />
                </label>
                <label>
                  Konfirmasi password baru
                  <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                </label>
                <button type="button" className="secondary-button" onClick={handleChangePassword}>
                  Ganti password admin
                </button>
              </article>
            </div>

            <div className="admin-grid">
              <article className="admin-card">
                <h3>Timeline</h3>
                <label>
                  Timeline (JSON)
                  <textarea
                    rows={14}
                    value={JSON.stringify(draft.timeline, null, 2)}
                    onChange={(event) => {
                      try {
                        const timeline = JSON.parse(event.target.value)
                        setDraft((prev) => ({ ...prev, timeline }))
                      } catch {
                        //
                      }
                    }}
                  />
                </label>
              </article>

              <article className="admin-card">
                <h3>Highlight dokumentasi</h3>
                <label>
                  Highlights (JSON)
                  <textarea
                    rows={14}
                    value={JSON.stringify(draft.highlights, null, 2)}
                    onChange={(event) => {
                      try {
                        const highlights = JSON.parse(event.target.value)
                        setDraft((prev) => ({ ...prev, highlights }))
                      } catch {
                        //
                      }
                    }}
                  />
                </label>
              </article>
            </div>

            <div className="admin-actions">
              <button type="button" className="primary-button" onClick={() => onSave(draft)}>
                Simpan perubahan
              </button>
              <button type="button" className="secondary-button" onClick={() => setDraft(content)}>
                Batalkan perubahan
              </button>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
