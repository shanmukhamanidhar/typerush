/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6A00',
          'orange-primary': '#FF6A00',
          'orange-bright': '#FF7A18',
          'orange-soft': '#FF9A3D',
          'orange-dark': '#D94F00',
          DEFAULT: '#FF6A00',
          primary: '#FF6A00',
          success: '#FF6A00',
          error: '#FF3B5C',
          // Fallback aliases so any legacy class mapping renders the orange theme
          cyan: '#FF6A00',
          violet: '#FF9A3D',
          neon: '#FF7A18',
          electric: '#FF6A00',
        },
        dark: {
          bg: '#080808',
          surface: '#111111',
          surface2: '#161616',
          card: '#111111',
          border: '#222222',
          borderSubtle: '#1C1C1C',
          muted: '#6B6B6B',
          text: '#F5F5F5',
        },
        light: {
          bg: '#FFFFFF',
          surface: '#F7F7F7',
          card: '#FFFFFF',
          border: '#E5E5E5',
          muted: '#6B6B6B',
          text: '#111111',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 20px -2px rgba(255, 106, 0, 0.20)',
        'glow-orange-lg': '0 0 30px -4px rgba(255, 106, 0, 0.30)',
        'glow-cyan': '0 0 20px -2px rgba(255, 106, 0, 0.20)',
        'glow-violet': '0 0 20px -2px rgba(255, 106, 0, 0.20)',
        'neon-cyan': '0 0 20px -2px rgba(255, 106, 0, 0.20)',
        'neon-glow': '0 0 20px -2px rgba(255, 106, 0, 0.20)',
        'glow-error': '0 0 16px -2px rgba(255, 59, 92, 0.3)',
      },
      animation: {
        'cursor-blink': 'blink 0.9s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}
