// Site configuration
export const SITE_CONFIG = {
  name: 'FM Global Careers',
  tagline: 'Your Gateway to Fluid Mechanics Excellence',
  description: 'FM Global Careers offers specialized training and international placement services in the fluid mechanics industry.',

  // Sub-brands
  institute: {
    name: 'FM Institute',
    tagline: 'Training Division',
    description: 'Specialized training programs in fluid mechanics',
  },
  international: {
    name: 'FM International',
    tagline: 'Placement Division',
    description: 'Global job opportunities in fluid mechanics',
  },
} as const

// Navigation links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/training', label: 'Training' },
  { href: '/placement', label: 'Placement' },
  { href: '/verify', label: 'Verify Certificate' },
  { href: '/contact', label: 'Contact' },
] as const

// Certificate ID prefix
export const CERTIFICATE_PREFIX = 'FMI'

// Course codes (add more as needed)
export const COURSE_CODES = {
  PR: 'Practical Training',
  TH: 'Theory Course',
  AD: 'Advanced Program',
  FD: 'Foundation Course',
} as const
