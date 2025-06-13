import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

import { createFluidValue } from './lib/create-fluid-value';

const config: Config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        lg: '1128px',
        xl: '1176px',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        '.scrollbar': {
          overflowY: 'auto',
          scrollbarColor: `hsl(var(--brand-1) / 0.85) transparent`,
          scrollbarWidth: 'thin',
        },
        '.scrollbar::-webkit-scrollbar': {
          height: '2px',
          width: '2px',
        },
        '.scrollbar::-webkit-scrollbar-thumb': {
          backgroundColor: 'hsl(var(--brand-1) / 0.85)',
        },
        '.scrollbar::-webkit-scrollbar-track-piece': {
          backgroundColor: 'transparent',
        },
        '.scrollbar-neutral': {
          scrollbarColor: `hsl(var(--foreground) / 0.3) transparent`,
        },
        '.scrollbar-neutral::-webkit-scrollbar-thumb': {
          backgroundColor: 'hsl(var(--foreground) / 0.3)',
        },
        '.scrollbar-none': {
          scrollbarColor: 'transparent transparent',
        },
        '.scrollbar-neutral-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: `hsl(var(--foreground) / 0.3) transparent`,
        },
        '.scrollbar-neutral-thin::-webkit-scrollbar:horizontal': {
          height: '2px',
        },
        '.scrollbar-neutral-thin::-webkit-scrollbar:vertical': {
          width: '2px',
        },
        '.scrollbar-neutral-thin::-webkit-scrollbar-thumb': {
          backgroundColor: 'hsl(var(--foreground) / 0.3)',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
        },
        '.scrollbar-neutral-thin::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'hsl(var(--foreground) / 0.5)',
        },
        '.scrollbar-neutral-thin::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
      });
    }),
    animate,
  ],
};

export default config;
