
export const extractGoogleDriveId = (input: string): string => {
  const cleaned = input.trim()

  if (!cleaned) return ''

  const patterns = [
    /\/folders\/([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[\?&]id=([a-zA-Z0-9_-]+)/,
    /^([a-zA-Z0-9_-]{10,})$/
  ]

  for (const pattern of patterns) {
    const match = cleaned.match(pattern)
    if (match?.[1]) return match[1]
  }

  return ''
}

export const normalizeDriveSource = (input: string) => input.trim()

export const isDriveFolderSource = (input: string) => /\/folders\//.test(input.trim())

export const buildDriveFolderEmbedUrl = (folderId: string, view: 'grid' | 'list' = 'grid') =>
  folderId ? `https://drive.google.com/embeddedfolderview?id=${folderId}#${view}` : ''

export const buildDrivePreviewUrl = (fileId: string) =>
  fileId ? `https://drive.google.com/file/d/${fileId}/preview` : ''

export const buildDriveImageUrl = (fileId: string) =>
  fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600` : ''

export const buildDriveVideoThumbnailUrl = (fileId: string) =>
  fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200` : ''

export const buildDriveImageFallbackUrl = (fileId: string, size = 'w1600') =>
  fileId ? `https://lh3.googleusercontent.com/d/${fileId}=${size}` : ''

export const buildDriveUserContentImageUrl = (fileId: string) =>
  fileId ? `https://drive.usercontent.google.com/download?id=${fileId}&export=view&authuser=0` : ''

export const buildDriveOpenUrl = (fileId: string) =>
  fileId ? `https://drive.google.com/file/d/${fileId}/view` : ''

export const buildDriveFolderOpenUrl = (folderId: string) =>
  folderId ? `https://drive.google.com/drive/folders/${folderId}` : ''

export const buildBestDriveOpenUrl = (source: string, fileId?: string) => {
  const cleaned = source.trim()
  if (cleaned.startsWith('http')) return cleaned

  if (cleaned.includes('/folders/')) {
    const folderId = extractGoogleDriveId(cleaned)
    return buildDriveFolderOpenUrl(folderId)
  }

  if (fileId) return buildDriveOpenUrl(fileId)
  return ''
}
