export const extractGoogleDriveId = (input: string): string => {
  const cleaned = input.trim()

  if (!cleaned) return ''

  const patterns = [
    /\/folders\/([a-zA-Z0-9_-]+)/,
    /[\?&]id=([a-zA-Z0-9_-]+)/,
    /^([a-zA-Z0-9_-]{10,})$/
  ]

  for (const pattern of patterns) {
    const match = cleaned.match(pattern)
    if (match?.[1]) return match[1]
  }

  return ''
}

export const buildDriveFolderEmbedUrl = (folderId: string, view: 'grid' | 'list' = 'grid') =>
  folderId
    ? `https://drive.google.com/embeddedfolderview?id=${folderId}#${view}`
    : ''

export const buildDrivePreviewUrl = (fileId: string) =>
  fileId ? `https://drive.google.com/file/d/${fileId}/preview` : ''

export const buildDriveImageUrl = (fileId: string) =>
  fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600` : ''

export const buildDriveDownloadUrl = (fileId: string) =>
  fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : ''
