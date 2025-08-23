import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1FBF7A',
          600: '#18a868'
        },
        ocean: '#0ea5e9'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
} satisfies Config;