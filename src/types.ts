export type MediaType = 'photo' | 'video' | 'drive-folder'

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
  aboutTitle: string
  aboutText: string
  storyText: string
  membersNote: string
  memberCount: number
  adminPassphraseHint: string
  driveFolderUrl: string
  driveFolderId: string
  stats: StatItem[]
  timeline: TimelineItem[]
  members: MemberItem[]
  highlights: HighlightItem[]
  quotes: QuoteItem[]
}
