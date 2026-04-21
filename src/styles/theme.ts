// Central theme token definitions — mirrors tailwind.config.js
// Use these in framer-motion variants or inline styles where Tailwind classes aren't suitable

export const theme = {
  colors: {
    black: {
      DEFAULT: '#0A0A0A',
      900: '#0A0A0A',
      800: '#111111',
      700: '#1A1A1A',
      600: '#222222',
      500: '#2A2A2A',
    },
    gold: {
      DEFAULT: '#C9A84C',
      light: '#E2C97E',
      dark: '#A8852A',
      muted: 'rgba(201,168,76,0.15)',
    },
    surface: {
      DEFAULT: '#141414',
      raised: '#1C1C1C',
      border: '#2A2A2A',
    },
    text: {
      primary: '#F5F5F5',
      secondary: '#9A9A9A',
      muted: '#555555',
    },
  },

  fonts: {
    heading: "'Sora', sans-serif",
    body: "'Inter', sans-serif",
    accent: "'Poppins', sans-serif",
  },

  spacing: {
    section: '7rem',
    sectionMobile: '4rem',
  },

  transitions: {
    fast: '0.15s ease',
    base: '0.3s ease',
    slow: '0.5s ease',
  },
} as const;

export type Theme = typeof theme;
