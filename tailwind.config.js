/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#104C64',
        secondary: '#D59D80',
        accent: '#C0754D',
        success: '#0D1D25',
        neutral: '#C6C6D0',
        dark: '#B6410F',
        background: '#FFFFFF',
        foreground: '#0F172A',
        card: '#FFFFFF',
        'card-foreground': '#0F172A',
        popover: '#FFFFFF',
        'popover-foreground': '#0F172A',
        muted: '#F8FAFC',
        'muted-foreground': '#64748B',
        destructive: '#EF4444',
        'destructive-foreground': '#FFFFFF',
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#104C64',
        'status-success': '#10B981', 
        'status-error': '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
