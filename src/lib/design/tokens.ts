export const colors = {
  // Deep blue typography & accents
  textPrimary: '#1F2A44',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Surfaces
  background: '#FFFFFF',
  softBackground: '#F6F7FA',
  surface: '#FFFFFF',

  // Brand blues
  accent: '#1F2A44', // primary action / links
  accentHover: '#151B30',
  accentLight: '#E3E7F5', // subtle tinted backgrounds
  accentDeep: '#2C2A7A', // footer / deep sections

  // Borders
  border: '#E6E8EF',
  borderHover: '#CDD2E5',

  // Feedback
  error: '#C44536',
  errorLight: '#FDECEC',
  success: '#2D6A4F',
  successLight: '#ECF6F2',
  warning: '#E09F3E',
  warningLight: '#FFF4DF',
  info: '#4A90D9',
  infoLight: '#E5F0FB',
} as const;

export const typography = {
  fontFamily: 'var(--font-heebo), system-ui, -apple-system, sans-serif',
  sizes: {
    display: { size: '3rem', lineHeight: '3.5rem', weight: '700' },
    h1: { size: '2.25rem', lineHeight: '2.75rem', weight: '700' },
    h2: { size: '1.875rem', lineHeight: '2.25rem', weight: '600' },
    h3: { size: '1.5rem', lineHeight: '2rem', weight: '600' },
    h4: { size: '1.25rem', lineHeight: '1.75rem', weight: '600' },
    body: { size: '1rem', lineHeight: '1.5rem', weight: '400' },
    bodyMedium: { size: '1rem', lineHeight: '1.5rem', weight: '500' },
    small: { size: '0.875rem', lineHeight: '1.25rem', weight: '400' },
    caption: { size: '0.75rem', lineHeight: '1rem', weight: '400' },
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

export const radius = {
  none: '0',
  sm: '0.125rem', // 2px
  md: '0.25rem',  // 4px
  lg: '0.375rem', // 6px
  xl: '0.5rem',   // 8px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 3px rgba(15, 23, 42, 0.06)',
  md: '0 4px 12px rgba(15, 23, 42, 0.06)',
  lg: '0 8px 18px rgba(15, 23, 42, 0.08)',
  xl: '0 12px 28px rgba(15, 23, 42, 0.10)',
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
} as const;
