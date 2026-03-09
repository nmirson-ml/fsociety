import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Terminal / hacker palette
        terminal: {
          bg: '#0d1117',
          fg: '#58a6ff',
          green: '#3fb950',
          red: '#f85149',
          yellow: '#d29922',
          cyan: '#39d353',
          gray: '#8b949e',
          border: '#30363d',
        },
        // UI palette
        surface: {
          50: '#f6f8fa',
          100: '#eaeef2',
          900: '#13161b',
          950: '#0d1117',
        },
      },
      fontFamily: {
        mono: ['Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scan': 'scan 2s linear infinite',
        'fadeIn': 'fadeIn 0.3s ease-in',
        'slideIn': 'slideIn 0.2s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
