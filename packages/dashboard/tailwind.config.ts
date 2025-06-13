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
        brand: {
          1: 'hsl(var(--brand-1))',
          2: 'hsl(var(--brand-2))',
          3: 'hsl(var(--brand-3))',
          4: 'hsl(var(--brand-4))',
          5: 'hsl(var(--brand-5))',
          6: 'hsl(var(--brand-6))',
        },
        'smoke-gray': {
          1: 'hsl(var(--smoke-gray-1))',
          2: 'hsl(var(--smoke-gray-2))',
          3: 'hsl(var(--smoke-gray-3))',
          4: 'hsl(var(--smoke-gray-4))',
          5: 'hsl(var(--smoke-gray-5))',
          6: 'hsl(var(--smoke-gray-6))',
        },
        'body-text': 'hsl(var(--body-text))',
        'body-text-secondary': 'hsl(var(--body-text-secondary))',
        'body-text-invert': 'hsl(var(--body-text-invert))',
        divider: 'hsl(var(--divider))',
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
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
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
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        inter: 'var(--font-inter)',
        poppins: 'var(--font-poppins)',
        merriweather: 'var(--font-merriweather)',
      },
      fontSize: {
        'fluid-xs': createFluidValue(12, 14),
        'fluid-sm': createFluidValue(14, 16),
        'fluid-base': createFluidValue(16, 18),
        'fluid-lg': createFluidValue(18, 20),
        'fluid-xl': createFluidValue(20, 24),
        'fluid-2xl': createFluidValue(24, 30),
        'fluid-3xl': createFluidValue(40, 48),
        'fluid-4xl': createFluidValue(54, 72),
      },
      boxShadow: {
        glow: '0 0 10px #3b82f6, 0 0 20px #3b82f6',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        fadeOutDown: {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        slideIn: {
          '0%': {
            transform: 'translateY(-10px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        pulse: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-out-down': 'fadeOutDown var(--animation-duration) ease-in-out forwards',
        'fade-in-up': 'fadeInUp var(--animation-duration) ease-in-out forwards',
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideIn: 'slideIn 0.4s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
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
