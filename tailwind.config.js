/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Paleta de colores personalizada de AM · Productivity OS
      colors: {
        accent:   '#00ff88',
        surface:  '#141414',
        surface2: '#1c1c1c',
        danger:   '#ff4757',
        warn:     '#ffd32a',
        info:     '#00b4ff',
        muted:    '#444444',
      },
      // Tipografía personalizada
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"Syne"', 'sans-serif'],
      },
      // Animaciones personalizadas
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.35s ease forwards',
        fadeIn: 'fadeIn 0.25s ease forwards',
      },
    },
  },
  plugins: [],
}
