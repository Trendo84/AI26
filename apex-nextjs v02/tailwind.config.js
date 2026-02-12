/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        cyber: ['Rajdhani', 'sans-serif'],
        matrix: ['Share Tech Mono', 'monospace'],
      },
      colors: {
        apex: { accent: '#00d4ff', green: '#00e68a', red: '#ff4466', orange: '#ffaa33', purple: '#a855f7' },
      },
    },
  },
  plugins: [],
}
