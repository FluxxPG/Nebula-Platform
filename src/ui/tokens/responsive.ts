export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  
  // Max width queries
  maxXs: `@media (max-width: ${breakpoints.xs})`,
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
  maxLg: `@media (max-width: ${breakpoints.lg})`,
  maxXl: `@media (max-width: ${breakpoints.xl})`,
  
  // Touch devices
  touch: '@media (hover: none) and (pointer: coarse)',
  
  // Reduced motion
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
};

export const responsive = {
  // Responsive spacing
  spacing: {
    xs: { padding: '0.5rem', margin: '0.5rem' },
    sm: { padding: '1rem', margin: '1rem' },
    md: { padding: '1.5rem', margin: '1.5rem' },
    lg: { padding: '2rem', margin: '2rem' },
    xl: { padding: '3rem', margin: '3rem' },
  },
  
  // Responsive typography
  typography: {
    xs: {
      h1: '1.5rem',
      h2: '1.25rem',
      h3: '1.125rem',
      body: '0.875rem',
      small: '0.75rem',
    },
    sm: {
      h1: '2rem',
      h2: '1.5rem',
      h3: '1.25rem',
      body: '1rem',
      small: '0.875rem',
    },
    md: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.5rem',
      body: '1rem',
      small: '0.875rem',
    },
    lg: {
      h1: '3rem',
      h2: '2.5rem',
      h3: '2rem',
      body: '1.125rem',
      small: '1rem',
    },
  },
  
  // Grid columns for different breakpoints
  grid: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
    '2xl': 12,
  },
};