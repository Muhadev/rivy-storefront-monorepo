export const fontConfig = {
  families: {
    primary: {
      name: 'Inter',
      weights: [300, 400, 500, 600, 700],
      fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    secondary: {
      name: 'JetBrains Mono',
      weights: [400, 500, 600],
      fallback: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    },
  },
  
  sizes: {
    xs: {
      fontSize: '0.75rem',
      lineHeight: '1rem',
    },
    sm: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
    },
    base: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
    lg: {
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
    },
    xl: {
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
    },
    '2xl': {
      fontSize: '1.5rem',
      lineHeight: '2rem',
    },
    '3xl': {
      fontSize: '1.875rem',
      lineHeight: '2.25rem',
    },
    '4xl': {
      fontSize: '2.25rem',
      lineHeight: '2.5rem',
    },
    '5xl': {
      fontSize: '3rem',
      lineHeight: '1',
    },
    '6xl': {
      fontSize: '3.75rem',
      lineHeight: '1',
    },
  },
  
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// CSS-in-JS font loading
export const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

export type FontConfig = typeof fontConfig;