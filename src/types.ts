
export type MediaType = 'photo' | 'video' | 'drive-folder'
export type GalleryMode = 'manual' | 'automatic'

export interface StatItem {
  label: string
  value: string
  note: string
}

export interface TimelineItem {
  semester: string
  title: string
  description: string
  highlight: string
}

export interface MemberItem {
  name: string
  role: string
  description: string
}

export interface HighlightItem {
  title: string
  type: MediaType
  description: string
  driveFileId?: string
  driveSource?: string
  link?: string
}

export interface QuoteItem {
  quote: string
  name: string
  role: string
}

export interface SiteContent {
  groupName: string
  shortName: string
  tagline: string
  intro: string
  heroTitle: string
  heroDescription: string
  ctaPrimary: string
  ctaSecondary: string
  aboutEyebrow: string
  aboutTitle: string
  aboutDescription: string
  aboutCardTitle: string
  aboutText: string
  storyCardTitle: string
  storyText: string
  storyBullets: string[]
  journeyEyebrow: string
  journeyTitle: string
  journeyDescription: string
  galleryEyebrow: string
  galleryTitle: string
  galleryDescription: string
  footerTitle: string
  footerDescription: string
  membersNote: string
  memberCount: number
  adminPassphraseHint: string
  contactEmail: string
  instagramUrl: string
  tiktokUrl: string
  galleryMode: GalleryMode
  driveFolderUrl: string
  driveFolderId: string
  photoFolderUrl: string
  photoFolderId: string
  videoFolderUrl: string
  videoFolderId: string
  stats: StatItem[]
  timeline: TimelineItem[]
  members: MemberItem[]
  highlights: HighlightItem[]
  quotes: QuoteItem[]
}
