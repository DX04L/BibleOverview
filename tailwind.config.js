/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'border-subtle': 'var(--border-subtle)',
        'edge-default': 'var(--edge-default)',
        source: {
          luke: 'var(--source-luke)',
          matthew: 'var(--source-matthew)',
          shared: 'var(--source-shared)',
          other: 'var(--source-other)'
        },
        accent: {
          rose: 'var(--accent-rose)',
          gold: 'var(--accent-gold)'
        },
        status: {
          disputed: 'var(--status-disputed)'
        }
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
