/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        neutral: '#64748B',
        'space-blue': '#1E3A8A',
        'neon-green': '#10B981',
        'bright-orange': '#F59E0B',
        'dark-gray': '#0F172A',
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
