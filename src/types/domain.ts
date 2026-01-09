import type { Theme } from './theme'

export type WorkingHours = {
  weekday: number // 0=Sunday, 1=Monday, ... 6=Saturday
  start: string // HH:mm format
  end: string // HH:mm format
}

export type Service = {
  id: string
  name: string
  description: string
  durationMin: number
  priceCents: number
  notes?: string | null
}

export type ReviewSnippet = {
  id: string
  quote: string
  author: string
}

export type Address = {
  line1: string
  city: string
  region: string
  postalCode: string
  country: string
}

export type Contact = {
  phone: string
  email: string
}

export type Rating = {
  score: number
  count: number
}

export type GalleryImage = {
  id: string
  src: string
  alt: string
}

export type About = {
  title?: string
  description?: string
}

export type HighlightIcon = 'scissors' | 'sparkles' | 'clock' | 'shield' | 'leaf' | 'star'

export type Highlight = {
  id: string
  label: string
  icon?: HighlightIcon
}

export type Social = {
  instagram?: string
  website?: string
}

export type Loyalty = {
  enabled: boolean
  target: number
  rewardLabel: string
}

export type Business = {
  id: string
  slug: string
  name: string
  category: string
  shortDescription: string
  rating: Rating
  contact: Contact
  address: Address
  timezone: string
  workingHours: WorkingHours[]
  services: Service[]
  reviews: ReviewSnippet[]
  theme: Theme
  heroImage?: string
  gallery?: GalleryImage[]
  about?: About
  highlights?: Highlight[]
  social?: Social
  loyalty?: Loyalty
  googleReviewUrl?: string
}
