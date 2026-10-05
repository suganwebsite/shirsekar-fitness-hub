export type LeadStatus = 'new' | 'contacted' | 'follow-up' | 'converted' | 'lost';
export type LeadSource = 'free_trial' | 'membership_enquiry' | 'contact_form' | 'phone_call' | 'whatsapp';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  goal: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  tagline: string;
  priceDisplay: string;
  duration: string;
  features: string[];
  discountOffer?: string;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  duration: string;
  difficulty: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  isActive: boolean;
  order: number;
}

export interface Facility {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  highlights: string[];
  isActive: boolean;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'gym' | 'equipment' | 'training' | 'community' | 'exterior';
  imageUrl: string;
  caption?: string;
  isFeatured: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  rating: number;
  comment: string;
  source: 'Google Review' | 'Member Feedback';
  date: string;
  isPublished: boolean;
  sentiment?: 'positive' | 'balanced';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface BusinessSettings {
  businessName: string;
  marathiName: string;
  managementBy: string;
  marathiManagement: string;
  tagline: string;
  heroHeading: string;
  heroDescription: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  phone: string;
  rawPhone: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  trialWhatsappMessage: string;
  email: string;
  address: string;
  landmark: string;
  timingsWeekday: string;
  timingsSunday: string;
  currentStatusNote: string;
  googleRating: number;
  googleReviewCount: number;
  googleMapsEmbedUrl: string;
  googleMapsDirectUrl: string;
  googleReviewsUrl: string;
  heroImageUrl: string;
  facilityHeroUrl: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  seoTitle: string;
  seoDescription: string;
  googleAnalyticsId?: string;
  metaPixelId?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'manager';
  lastLogin?: string;
}
