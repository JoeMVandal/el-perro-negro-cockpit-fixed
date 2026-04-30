import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        agave: {
          50: '#F7F3EB',
          100: '#EFEBE0',
          200: '#DFD5C5',
          300: '#C29A2D',
          400: '#B88A25',
          500: '#A67C28',
          600: '#8B6620',
          700: '#704F18',
          800: '#553810',
          900: '#3B2608',
        },
        ink: {
          50: '#F8F8F8',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#D0D0D0',
          400: '#999999',
          500: '#666666',
          600: '#333333',
          700: '#2D2D2D',
          800: '#1A1A1A',
          900: '#000000',
        },
      },
      fontFamily: {
        display: ['Chango', 'sans-serif'],
        accent: ['Alfa Slab One', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'display-lg': '3.5rem',
        'display-md': '2.5rem',
        'display-sm': '1.875rem',
      },
    },
  },
  plugins: [],
}

export default config
